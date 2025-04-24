import { deleteMediaFiles, putRequestApi } from "@/lib/apiLibrary";
import { uploadMediaFiles } from "@/lib/uploadMediaClient";
import { ListingWorkflow } from "@/lib/typings/enums";
import { Button, Progress } from "@heroui/react";
import { Plus, X } from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDropzone } from 'react-dropzone';
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const MultiImage = ({ imageParams, uploadSuccess, setIsImagesInGallery, setEditMode, allowedNumber }: any) => {
    const { data }: any = useSession();
    const [files, setFiles] = useState<any[]>([]);
    const [existingFiles, setExistingFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [delFilesList, setDelFilesList] = useState<any[]>([]);
    const [totalFiles, setTotalFiles] = useState(0);
    const onDrop = useCallback((acceptedFiles: any[]) => {
        setFiles(prevFiles => {
            const fileNos = existingFiles.length + prevFiles.length + acceptedFiles.length;
            if (fileNos > allowedNumber) {
                toast.warning("You can only upload up to " + allowedNumber + " images.");
                return prevFiles;
            } else {
                setTotalFiles(fileNos);
                return [
                    ...prevFiles,
                    ...acceptedFiles.map(file => Object.assign(file, {
                        preview: URL.createObjectURL(file),
                        progress: 0,
                    }))
                ];
            }
        });
    }, [existingFiles, files]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop,
        onDropRejected: () => {
            toast.error("Only JPG, JPEG, PNG, WEBP, and HEIC formats are allowed.");
        }
    });

    const removeFile = useCallback((fileToRemove: any) => {
        setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
    }, []);

    const removeExtFile = useCallback((id: any, fileToRemove: any) => {
        setExistingFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
        setDelFilesList(prevList => [...prevList, id]);
    }, []);

    const uploadImageWithContent = useCallback(async () => {
        let allSuccessful = false;
        try {
            setLoading(true);

            // Batch delete existing images
            if (delFilesList.length > 0) {
                await Promise.all(delFilesList.map(id => deleteMediaFiles(id)));
            }

            // Upload files in parallel
            if (files.length > 0) {
                let updateStep: any = null;
                const uploadPromises = files.map(async (file, index) => {
                    // const compressed = await CompressAndConvertToWebP(file);
                    const formData = new FormData();
                    Object.keys(imageParams).forEach(key => {
                        formData.append(key, imageParams[key]);
                    });
                    const fileName = `${imageParams.ref.split(".")[1]}_GI_${imageParams.refId}_${file.name}`;
                    // formData.append("files", compressed, fileName.replace(' ', '-').replace(/\.\w+$/, '.webp'));
                    formData.append("files", file, fileName.replace(' ', '-'));
                    const response = await uploadMediaFiles(formData, data?.strapiToken, (progressEvent) => {
                        const percent = Math.round((progressEvent.loaded ?? 0) * 100 / (progressEvent.total ?? 1));
                        setFiles(prevFiles => {
                            const updated = [...prevFiles];
                            updated[index].progress = percent;
                            return [...updated];
                        });
                    });
                    let payload = {
                        step_number: imageParams.step_number === ListingWorkflow.Payment ? ListingWorkflow.Payment : ListingWorkflow.UploadImages,
                        publish_status: imageParams.publish_status
                    }
                    if (response) updateStep = await putRequestApi(imageParams.endpoint, payload, imageParams.refId);
                    return updateStep;
                });
                const results = await Promise.allSettled(uploadPromises);
                allSuccessful = results.every(result => result.status === "fulfilled");

                results.forEach((result, index) => {
                    if (result.status === "rejected") {
                        console.error(`File ${index + 1} upload failed:`, result?.reason);
                    }
                });
                await Promise.all(uploadPromises);
            }
        } catch (error) {
            console.error("An error occurred during the upload process:", error);
            toast.error("Failed to upload images.");
        } finally {
            if (allSuccessful) {
                const payload = {
                    step_number: imageParams.step_number === ListingWorkflow.Payment
                        ? ListingWorkflow.Payment
                        : ListingWorkflow.UploadImages,
                    publish_status: imageParams.publish_status
                };
                try {
                    await putRequestApi(imageParams.endpoint, payload, imageParams.refId);
                } catch (updateError) {
                    console.error("Error Occured:", updateError);
                }
            }
            setLoading(false);
            uploadSuccess();
        }
    }, [delFilesList, files, imageParams, uploadSuccess]);

    const newImgPreview = useMemo(() => (
        files.length > 0 && files.map((file: any) => (
            <div key={file.name} className="relative">
                {loading &&
                    <div className="absolute inset-0 flex items-center justify-center z-10 px-5">
                        <Progress
                            aria-label="Uploading..."
                            className="w-full"
                            color="success"
                            size="md"
                            value={file.progress}
                        />
                    </div>
                }
                <div className={`relative transition-all duration-300 hover:brightness-90 ${loading && 'brightness-90'}`}>
                    <img className="border object-cover w-80 aspect-square rounded-md" src={file.preview}
                        onLoad={() => { URL.revokeObjectURL(file.preview) }}
                    />
                    {!loading &&
                        <button className="absolute top-3 right-3 cursor-pointer bg-slate-900/90 hover:bg-red-700 rounded-full p-1" onClick={() => removeFile(file)}>
                            <X size={16} className="text-white/90" />
                        </button>
                    }
                </div>
            </div>
        ))
    ), [files, removeFile, loading]);

    const existingImageBlock = useMemo(() => (
        existingFiles && existingFiles.map((file: any) => (
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
    }, [imageParams.imgData]);

    useEffect(() => {
        setTotalFiles((existingFiles?.length || 0) + files.length)
    }, [imageParams.imgData, files, existingFiles]);

    const isImagesInGallery = files.length > 0 || delFilesList.length > 0;

    useEffect(() => {
        setIsImagesInGallery(isImagesInGallery);
        isImagesInGallery ? setEditMode(true) : setEditMode(false);
    }, [isImagesInGallery, setIsImagesInGallery]);

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between">
                <div className='card-header text-xl font-semibold mb-5'>Gallery Images</div>
                {isImagesInGallery &&
                    <div className="flex justify-center mb-4">
                        <Button color="secondary" size="sm" className="w-full md:w-auto rounded-lg py-2" isLoading={loading} onPress={uploadImageWithContent}>
                            Save Images to Gallery
                        </Button>
                    </div>
                }
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {existingImageBlock}
                {newImgPreview}
                {(totalFiles < allowedNumber) &&
                    Array.from({ length: allowedNumber - totalFiles }).map((_, index) =>
                        <div key={index} {...getRootProps({ className: 'w-full' })}>
                            <div className="flex flex-col items-center justify-center w-full aspect-square border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Plus className="text-gray-500" stroke="currentColor" strokeWidth={2} size={40} strokeLinecap="round" strokeLinejoin="round" />
                                </div>
                                <input disabled={loading || files.length >= allowedNumber} id="dropzone-file" type="file" multiple className="hidden" {...getInputProps()} />
                            </div>
                        </div>
                    )
                }
            </div>
            {isImagesInGallery &&
                <div className="flex justify-center mb-4">
                    <Button color="secondary" size="sm" className="w-auto rounded-lg py-2" isLoading={loading} onPress={uploadImageWithContent}>
                        Save Images to Gallery
                    </Button>
                </div>
            }
        </>
    )
}

export default MultiImage;
