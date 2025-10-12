export interface ApiFilter {
    base: string
    sort: string
    populate: string
    limit: number
}
export interface SearchPayload {
    indexUid: string
    q: string | any
    filter?: string[] | any
    noExpFilter?: boolean
    searchFacets?: any[]
    sort?: any[]
    page?: number
    hitsPerPage?: number
}
export interface SingleItemData {
    id: any
    data: {}
    pagination: any
}
export interface RealEstate {
    id: any
    data: any
    listing_manager: any
    pagination: any
}
export interface ContactList {
    full_name: string
    phone: string | any
    email_id: string
}
export interface BusinessHours {
    day: string
    open_time: Set<string>
    close_time: Set<string>
    isOpen: boolean
}
export interface BusinessListing {
    area: any
    name: string | undefined
    full_address: string | undefined
    description: string | undefined
    contact: ContactComponent
    tags: string | undefined
    sub_category: string | undefined
    gallery_images?: any[]
    category: string | undefined
    website: string | undefined
    services: any[]
    bus_hours: BusinessHours[] | any
    featured_image?: {}
    step_number: number
    location: any
    activity_log: ActivityLog[]
}
export interface ActivityLog {
    event: string | undefined
    processed: string | undefined
}
export interface AdListing {
    name: string | undefined
    contact: ContactComponent
    user: {}
    website: string | undefined
    ad_image?: {}
    step_number: number
    activity_log: ActivityLog[]
}
export interface ImageParams {
    refId: string | any
    ref: string
    field: string
    imgData: any
    step_number: number
    publish_status: boolean
    endpoint: string
}
export interface ContactComponent {
    contact_name: string
    contact_number: string
    contact_email_id: string
}
export interface PropertyListing {
    listing_type: string
    property_type: string
    room_type: string
    area: string
    name: string | undefined
    description: string | undefined
    step_number: number
    location: any
    full_address: string
    contact: ContactComponent
    featured_image?: {}
    gallery_images?: any[]
    details_by_listingtype: [RentComponent | SaleComponent | PGComponent | PlotComponent | any]
    activity_log: ActivityLog[]
}
export interface RentComponent {
    __component: string
    bathrooms: number
    direction: string
    floor_number: number
    total_floors: number
    carpet_area: number
    superbuiltup_area: number
    builtup_area: number
    plot_area: number
    parking_type: string
    furnishing: string
    rental_amount: number
    deposit_amount: number
    amenities: any[],
    room_type: string
}
export interface SaleComponent {
    __component: string
    bathrooms: number
    direction: string
    floor_number: number
    total_floors: number
    carpet_area: number
    superbuiltup_area: number
    builtup_area: number
    plot_area: number
    parking_type: string
    furnishing: string
    selling_amount: number
    amenities: any[],
    room_type: string
}
export interface PGComponent {
    __component: string
    amenities: any[],
    room_type: OccupancyType
}
export interface PlotComponent {
    __component: string
    dimension_length: number
    dimension_breadth: number
    direction: string
    plot_area: number
    area_unit: string
    selling_amount: string
    amenities: any[],
}
export interface OccupancyType {
    occupancy_type: string
    amount: number
}
export interface ClassifiedListing {
    name: string | undefined
    area: any
    sale_amount: number
    description: string | undefined
    contact: ContactComponent
    slug: string | undefined
    tags: string | undefined
    category: string | undefined
    ownership_history: string
    year_of_purchase: string | any
    featured_image?: {}
    gallery_images?: any[]
    step_number: number
    details_by_category: [VehicleDetailsComponent] | any[]
    activity_log: ActivityLog[]
}
export interface VehicleDetailsComponent {
    __component: string
    fuel_type: string
    model_name: string
    transmission: string
    kms_driven: string
    year_of_manufacture: string
}
export interface JobListing {
    job_title: string | undefined
    category: string | undefined
    job_description: string | undefined
    preferred_languages: any[]
    area: any
    full_address: string
    gender: string
    contact: ContactComponent
    step_number: number
    details_by_jobCategory: [CorporateJobDetailsComponent | PersonalJobDetailsComponent | any]
    activity_log: ActivityLog[]
}
export interface CorporateJobDetailsComponent {
    __component: string
    company_name: string | undefined
    designation: string | undefined
    job_type: string
    educational_qualification: string
    job_experience: string
    experience_in_years: string
    work_mode: string
    salary_type: string | undefined
    salary_range_min: string | undefined
    salary_range_max: string | undefined
    open_positions: number
    job_shift: string
    interview_mode: string
}
export interface PersonalJobDetailsComponent {
    __component: string
    job_timing_from: string | undefined
    job_timing_to: string | undefined
    salary_range_min: string | undefined
    salary_range_max: string | undefined
}
export interface RazOrderPayload {
    planAmount: any
    totalAmount: any
    receiptId: string
    planLabel: string
    propertyData?: string
    subscriptionType: string
    productName: string
    planStartDate: string
    planExpiryDate: string
    gst: string
    customerName: string
    customerEmail: string
    customerPhone: string
    itemName: string
}