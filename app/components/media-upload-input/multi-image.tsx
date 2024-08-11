import { deleteMediaFiles, uploadMediaFiles } from "@/lib/apiLibrary";
import { Button } from "@nextui-org/react";
import { Plus, X } from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDropzone } from 'react-dropzone';
import { toast } from "react-toastify";

const MultiImage = ({ imageParams, uploadSuccess }: any) => {
    const [files, setFiles] = useState<any[]>([]);
    const [existingFiles, setExistingFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [delFilesList, setDelFilesList] = useState<any[]>([]);
    const onDrop = useCallback((acceptedFiles: any[]) => {
        setFiles(prevFiles => {
            const newFiles = acceptedFiles.filter(file => {
                const isDuplicate = prevFiles.some(existingFile => existingFile.name === file.name);
                if (isDuplicate) {
                    alert(`File with the name "${file.name}" already exists.`);
                }
                return !isDuplicate;
            });
            return [
                ...prevFiles,
                ...newFiles.map(file => Object.assign(file, {
                    preview: URL.createObjectURL(file)
                }))
            ];
        });
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': [] },
        onDrop
    });

    const removeFile = useCallback((fileToRemove: any) => {
        setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
    }, []);

    const removeExtFile = useCallback((id: any, fileToRemove: any) => {
        setExistingFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
        setDelFilesList(prevList => [...prevList, id]);
    }, []);

    const uploadImageWithContent = useCallback(async () => {
        try {
            setLoading(true);

            // Batch delete existing images
            if (delFilesList.length > 0) {
                await Promise.all(delFilesList.map(id => deleteMediaFiles(id)));
            }

            // Upload files in parallel
            if (files.length > 0) {
                const uploadPromises = files.map(file => {
                    const formData = new FormData();
                    Object.keys(imageParams).forEach(key => {
                        formData.append(key, imageParams[key]);
                    });
                    formData.append("files", file);
                    return uploadMediaFiles(formData);
                });

                await Promise.all(uploadPromises);
            }
        } catch (error) {
            console.error("An error occurred during the upload process:", error);
            toast.error("Failed to upload images.");
        } finally {
            setLoading(false);
            uploadSuccess();
        }
    }, [delFilesList, files, imageParams, uploadSuccess]);

    const newImgPreview = useMemo(() => (
        files.map((file: any) => (
            <div className="relative transition-all duration-300 hover:brightness-90" key={file.name}>
                <img className="border object-cover w-80 aspect-square rounded-md" src={file.preview}
                    onLoad={() => { URL.revokeObjectURL(file.preview) }}
                />
                <button className="absolute top-3 right-3 cursor-pointer bg-slate-900/90 hover:bg-red-700 rounded-full p-1" onClick={() => removeFile(file)}>
                    <X size={16} className="text-white/90" />
                </button>
            </div>
        ))
    ), [files, removeFile]);

    const existingImageBlock = useMemo(() => (
        existingFiles.map((file: any) => (
            <div className="relative transition-all duration-300 hover:brightness-90" key={file.name}>
                <img className="border object-cover w-80 aspect-square rounded-md" src={file.url} />
                <button disabled={loading} className="absolute top-3 right-3 cursor-pointer bg-slate-900/90 hover:bg-red-700 rounded-full p-1" onClick={() => removeExtFile(file.id, file)}>
                    <X size={16} className="text-white/90" />
                </button>
            </div>
        ))
    ), [existingFiles, removeExtFile]);

    useEffect(() => {
        return () => files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    }, [files]);

    useEffect(() => {
        setExistingFiles(imageParams.imgData);
    }, [imageParams]);

    return (
        <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {existingImageBlock}
                {newImgPreview}
                <div {...getRootProps({ className: 'w-full' })}>
                    <div className="flex flex-col items-center justify-center w-full aspect-square border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Plus className="text-gray-500" stroke="currentColor" strokeWidth={2} size={40} strokeLinecap="round" strokeLinejoin="round" />
                        </div>
                        <input disabled={loading} id="dropzone-file" type="file" multiple className="hidden" {...getInputProps()} />
                    </div>
                </div>
            </div>
            {((files.length > 0) || (delFilesList.length > 0)) &&
                <div className="flex justify-center mb-4">
                    <Button color="success" className="w-auto rounded-lg py-2" isLoading={loading} onClick={uploadImageWithContent}>
                        Save Images to Gallery
                    </Button>
                </div>
            }
        </>
    )
}

export default MultiImage;
