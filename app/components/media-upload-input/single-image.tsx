import { deleteMediaFiles, postRequestApi, uploadMediaFiles } from "@/lib/interceptor";
import { CircularProgress } from "@nextui-org/react";
import { Pencil, Trash, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';

const SingleImage = ({ imageParams }: any) => {

    const [files, setFiles] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const uploadImageWithContent = async () => {
        setLoading(true);
        let formData = new FormData();
        for (let key in imageParams) {
            if (imageParams.hasOwnProperty(key)) {
                formData.append(key, imageParams[key]);
            }
        }
        formData.append("files", files[0]);
        const response = await uploadMediaFiles(formData);
        if (response) setLoading(false);
    }

    const deleteImage = async (id: any) => {
        setLoading(true);
        const response = await deleteMediaFiles(id);
        console.log(response)
    }

    const newImage = files.map((file: any) => (
        <div className="flex justify-left gap-5 mb-6" key={file.name}>
            <div className="relative transition-all duration-300 hover:brightness-90">
                <img className="border object-cover w-80 h-48 rounded-md" src={file.preview}
                    onLoad={() => { URL.revokeObjectURL(file.preview) }}
                />
            </div>
            <div className="flex flex-col gap-5">
                <button className="w-14 h-14 border grid place-content-center rounded-md"><Pencil /></button>
                <button className="w-14 h-14 border grid place-content-center rounded-md" onClick={() => setFiles([])}><Trash2 /></button>
            </div>
        </div>
    ));

    const ExistingImage = () => (
        <div className="flex justify-left gap-5 mb-6">
            <div className="relative transition-all duration-300 hover:brightness-90">
                <img className="border object-cover w-80 h-48 rounded-md" src={imageParams.imgData.url} />
            </div>
            <div className="flex flex-col gap-5">
                <button className="w-14 h-14 border grid place-content-center rounded-md"><Pencil /></button>
                <button className="w-14 h-14 border grid place-content-center rounded-md" onClick={() => deleteImage(imageParams.imgData.id)}><Trash2 /></button>
            </div>
        </div>
    )


    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    }, [files, imageParams]);


    return (
        <>
            {(files.length > 0) || (imageParams.imgData) ?
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
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" {...getInputProps()} />
                    </div>
                </div>
            }
            {files.length > 0 &&
                <div className="flex mb-4">
                    <button className="btn-primary w-auto rounded-lg py-2" onClick={uploadImageWithContent}>
                        {loading ? <CircularProgress size="sm" aria-label="Loading..." /> : "Upload Featured Image"}
                    </button>
                </div>
            }
        </>
    )
}

export default SingleImage