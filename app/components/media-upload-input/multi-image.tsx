import { deleteMediaFiles, uploadMediaFiles } from "@/lib/apiLibrary";
import { CircularProgress } from "@nextui-org/react";
import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';

const MultiImage = ({ imageParams }: any) => {

    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop: acceptedFiles => {
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
                ]
            });
        }
    });

    const removeFile = (fileToRemove: any) => {
        setFiles(x => x.filter(file => file !== fileToRemove));
    };

    const uploadImageWithContent = async () => {
        setLoading(true);
        files.forEach(async (file, i) => {
            let formData = new FormData();
            for (let key in imageParams) {
                if (imageParams.hasOwnProperty(key)) {
                    formData.append(key, imageParams[key]);
                }
            }
            formData.append("files", file);
            const response = await uploadMediaFiles(formData);
            if (response && (i === files.length - 1)) setLoading(false);
        })
    }

    const newImgPreview = files.map((file: any, i: any) => (
        <div className="relative transition-all duration-300 hover:brightness-90" key={file.name}>
            <img className="border object-cover w-80 aspect-square rounded-md" src={file.preview}
                onLoad={() => { URL.revokeObjectURL(file.preview) }}
            />
            <button className="absolute top-3 right-3 cursor-pointer bg-color2d/50 hover:bg-color2d/80 rounded-full p-1" onClick={() => removeFile(file)}>
                <X size={16} className="hover:text-black" />
            </button>
        </div>
    ));

    const ExistingImageBlock = () => {
        console.log(imageParams.imgData)
        return (imageParams.imgData.map((file: any, i: any) => (
            <div className="relative transition-all duration-300 hover:brightness-90" key={file.name}>
                <img className="border object-cover w-80 aspect-square rounded-md" src={file.url} />
                <button className="absolute top-3 right-3 cursor-pointer bg-color2d/50 hover:bg-color2d/80 rounded-full p-1" onClick={() => deleteImage(file.id)}>
                    <X size={16} className="hover:text-black" />
                </button>
            </div>
        )))
    };

    const deleteImage = async (id: any) => {
        setLoading(true);
        const response = await deleteMediaFiles(id);
        console.log(response)
    }

    useEffect(() => {
        console.log(imageParams)
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    }, [files, imageParams]);


    return (
        <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <>
                    {imageParams.imgData && <ExistingImageBlock />}
                    {newImgPreview}
                </>
                <div {...getRootProps({ className: 'w-full' })}>
                    <div className="flex flex-col items-center justify-center w-full aspect-square border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Plus className="text-gray-500" stroke="currentColor" strokeWidth={2} size={40} strokeLinecap="round" strokeLinejoin="round" />
                        </div>
                        <input id="dropzone-file" type="file" multiple className="hidden" {...getInputProps()} />
                    </div>
                </div>
            </div>
            {files.length > 0 &&
                <div className="flex justify-center mb-4">
                    <button className="btn-primary w-auto rounded-lg py-2" onClick={uploadImageWithContent}>
                        {loading ? <CircularProgress size="sm" aria-label="Loading..." /> : "Save Images to Gallery"}
                    </button>
                </div>
            }
        </>
    )
}

export default MultiImage