import { Button } from '@heroui/react'
import React from 'react'
import { ContactComponent, PropertyListing } from '@/lib/typings/dto'
import { MoveLeft, MoveRight } from 'lucide-react'
import ContactForm from '@/app/components/forms/contact-form'

interface ChildProps {
    propertyListing: PropertyListing
    propertyDetails: any
    setPropertyDetails: React.Dispatch<React.SetStateAction<any>>
    disabled: boolean
    contact: ContactComponent
    setContact: React.Dispatch<React.SetStateAction<ContactComponent>>
    isSubmitLoading: boolean
    submitForm: () => void
    type: any
    prevStep: () => void
}

const ContactDetails: React.FC<ChildProps> = ({
    propertyListing,
    disabled,
    propertyDetails,
    setPropertyDetails,
    contact,
    setContact,
    isSubmitLoading,
    submitForm,
    type,
    prevStep
}) => {

    const handleContactDetails = (data: any) => {
        setContact(data)
        sessionStorage.setItem('contactDetails', JSON.stringify(data))
    }

    const handleFinalSubmit = () => {
        // Save property details & contact details to sessionStorage before submit
        sessionStorage.setItem('propertyDetails', JSON.stringify(propertyDetails))
        sessionStorage.setItem('contactDetails', JSON.stringify(contact))

        // Call the submit function
        submitForm()
    }

    return (
        <div className="listing-card border rounded-lg px-4 lg:px-7 py-6 shadow-lg min-h-[60vh]">
            <div className="grid h-full content-between">
                {/* Header */}
                <div>
                    <div className="card-header text-xl font-semibold mb-2">
                        Add your contact details
                    </div>
                    <p className="text-sm text-default-500 mb-6">
                        Note: Name and Phone Number will be visible to customers.
                    </p>

                    <ContactForm
                        txtContactDisabled={disabled || isSubmitLoading}
                        defaultContact={contact}
                        contactDetails={handleContactDetails}
                    />
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-between mt-8">
                    <Button
                        isDisabled={isSubmitLoading}
                        color="primary"
                        variant="flat"
                        size="md"
                        radius="sm"
                        startContent={<MoveLeft />}
                        onPress={prevStep}
                    >
                        Prev
                    </Button>

                    <Button
                        color="primary"
                        size="md"
                        radius="sm"
                        type="submit"
                        isLoading={isSubmitLoading}
                        endContent={<MoveRight />}
                        onPress={handleFinalSubmit}
                    >
                        {!isSubmitLoading && (type === "edit" ? "Save" : "Save and Continue")}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ContactDetails
