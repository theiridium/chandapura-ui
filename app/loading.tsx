import FormLoading from "./loading-components/form-loading"

const loading = () => {
    return (
        <div className="h-screen">
            <FormLoading text={'Loading...'} />
        </div>
    )
}

export default loading