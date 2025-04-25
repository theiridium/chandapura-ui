export enum ListingWorkflow {
    Initial,
    AddDetails,
    UploadImages,
    Review,
    Payment,
}
export enum JobCategory {
    Personal = "Personal",
    Corporate = "Corporate"
}

export enum ActivityLog {
    ListingCreated = "Listing - Create",
    ListingUpdated = "Listing - Edit",
    FiImagesUploaded = "Featured Image - Create",
    GiImagesUploaded = "Gallery Images - Create",
    FiImagesEdited = "Featured Image - Edit",
    GiImagesEdited = "Gallery Images - Edit",
    FiImageSkipped = "Feature Image - Skipped",
    PaymentNew = "Payment Completed - New",
    PaymentRenew = "Payment Completed - Renew",
    ListingReviewed = "Listing - Reviewed",
    ListingPosted = "Listing - Posted",
    ListingPublished = "Listing - Published (Admin)",
    ListingUnPublished = "Listing - UnPublished (Admin)",
}