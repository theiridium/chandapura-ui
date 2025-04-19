import { deleteMediaFiles, postRequestApi, putRequestApi } from "@/lib/apiLibrary";
import { CompressAndConvertToWebP } from "@/lib/helpers";
import { ListingWorkflow } from "@/lib/typings/enums";
import { uploadMediaFiles } from "@/lib/uploadMediaClient";
import { Button, CircularProgress, Progress, Spinner } from "@heroui/react";
import { Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
import { toast } from "react-toastify";

const SingleImage = ({ imageParams, uploadSuccess, setEditMode, setIsLoading }: any) => {
    const { data }: any = useSession();
    const [files, setFiles] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("Uploading Image...");
    const [isEditing, setIsEditing] = useState(false);
    const [blobUrls, setBlobUrls] = useState<any[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imgId, setImgId] = useState<any>(!!imageParams.imgData ? imageParams.imgData.id : null)
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/jpg': [],
            'image/png': [],
            'image/webp': [],
            'image/heic': []
        },
        onDropRejected: () => {
            toast.error("Only JPG, JPEG, PNG, WEBP, and HEIC formats are allowed.");
        },
        onDrop: acceptedFiles => {
            const newBlobUrls = acceptedFiles.map(file => URL.createObjectURL(file));
            setFiles(acceptedFiles);
            setBlobUrls(newBlobUrls);
            imageParams.imgData = null;
            uploadImageWithContent(acceptedFiles[0])
        }
    });

    const uploadImageWithContent = async (file: any) => {
        try {
            setLoading(true);
            setIsLoading(true);
            if (!!imgId) await deleteImage(imgId);
            let compressed = null;
            let formData = new FormData();
            if (file.type === "image/heic" && file.type === "image/webp") {
                compressed = file;
            }
            else {
                compressed = await CompressAndConvertToWebP(file);
                for (let key in imageParams) {
                    if (imageParams.hasOwnProperty(key)) {
                        formData.append(key, imageParams[key]);
                    }
                }
            }
            let updateStep = null;
            const fileName = `${imageParams.ref.split(".")[1]}_FI_${imageParams.refId}_${file.name}`;
            formData.append("files", compressed, fileName.replace(' ', '-').replace(/\.\w+$/, '.webp'));
            const response = await uploadMediaFiles(formData, data?.strapiToken, (progressEvent) => {
                const percent = Math.round((progressEvent.loaded ?? 0) * 100 / (progressEvent.total ?? 1));
                setUploadProgress(percent);
            });
            let payload = {
                step_number: imageParams.step_number === ListingWorkflow.Payment ? ListingWorkflow.Payment : ListingWorkflow.UploadImages,
                publish_status: imageParams.publish_status
            }
            if (!!response) {
                setLoadingText("Hang on....");
                updateStep = await putRequestApi(imageParams.endpoint, payload, imageParams.refId);
            }
            if (!!updateStep) {
                uploadSuccess();
                setIsEditing(false);
            }
            setIsLoading(false);
        }
        catch (error) {
            console.error('Image upload error:', error);
        }
    }

    useEffect(() => {
        isEditing ? setEditMode(true) : setEditMode(false);
    }, [isEditing])

    const deleteImage = async (id: any) => {
        try {
            const response = await deleteMediaFiles(id);
            // console.log(response)
        } catch (error) {
            toast.error('Failed to delete image');
        }
    }

    // const deleteImage = async (id: any) => {
    //     const isConfirmed = confirm('Are you sure you want to delete this image?');
    //     if (isConfirmed) {
    //         setLoading(true);
    //         try {
    //             const response = await deleteMediaFiles(id);
    //             if (response) uploadSuccess();
    //         } catch (error) {
    //             toast.error('Failed to delete image');
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    // }

    const newImage = files.map((file: any, index: number) => (
        <div className="flex justify-left gap-5 mb-6" key={file.name}>
            <div className="relative transition-all duration-300 hover:brightness-90 grow">
                <img className="border object-contain w-full h-full lg:h-80 rounded-md" src={blobUrls[index]}
                    onLoad={() => { URL.revokeObjectURL(blobUrls[index]) }}
                />
            </div>
            <div className="flex flex-col gap-5">
                <button disabled={loading} className="w-14 h-14 border grid place-content-center rounded-md hover:bg-color2d/70" onClick={() => setIsEditing(true)}><Pencil /></button>
                {/* <button disabled={loading} className="w-14 h-14 border grid place-content-center rounded-md hover:bg-color2d/70" onClick={() => { setFiles([]); setBlobUrls([]); }}><Trash2 /></button> */}
            </div>
        </div>
    ));

    const ExistingImage = () => (
        <div className="flex justify-left gap-5 mb-6">
            <div className="relative transition-all duration-300 hover:brightness-90 grow">
                <img className="border object-contain w-full h-full lg:h-80 rounded-md" src={imageParams.imgData.url} />
            </div>
            <div className="flex flex-col gap-5">
                <button disabled={loading} className="w-14 h-14 border grid place-content-center rounded-md hover:bg-color2d/70" onClick={() => setIsEditing(true)}>
                    {loading ? <Spinner size="md" /> :
                        <Pencil />}
                </button>
            </div>
        </div>
    )

    const LoadingPlaceholder = () => (
        <div>
            <Progress
                aria-label="Uploading..."
                className="w-full"
                color="success"
                showValueLabel={true}
                size="md"
                value={uploadProgress}
            />
            <div className="flex items-center justify-center w-full mb-5">
                <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-wait bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <CircularProgress aria-label="Loading..." color="default" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{loadingText}</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" {...getInputProps()} />
                </div>
            </div>
        </div>
    )

    const onCancelClick = () => {
        setIsEditing(false);
        setBlobUrls(files.map((file: any) => URL.createObjectURL(file)));
    }

    useEffect(() => {
        return () => {
            blobUrls.forEach((url: any) => URL.revokeObjectURL(url));
        };
    }, [files, imageParams, isEditing]);


    return (
        <>
            {loading ? <LoadingPlaceholder /> :
                (((files.length > 0) || (imageParams.imgData)) && !isEditing) ?
                    <>
                        {imageParams.imgData ? <ExistingImage /> : newImage}
                    </> :
                    <div {...getRootProps({ className: 'w-full' })} className="flex items-center justify-center w-full mb-5">
                        <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">PNG, JPG OR JPEG</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">(Ratio 4:3 or 16:9) Landscape image only</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" {...getInputProps()} />
                        </div>
                    </div>
            }
            <div className="flex mb-4 gap-x-5">
                {isEditing && !loading &&
                    <Button color="danger" className="w-auto rounded-lg py-2" onPress={() => onCancelClick()}>
                        Cancel
                    </Button>
                }
            </div>


        </>
    )
}

export default SingleImage