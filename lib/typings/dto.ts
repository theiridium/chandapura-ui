export interface ApiFilter {
    base: string
    sort: string
    populate: string
    limit: number
}
export interface SearchPayload {
    indexUid: string
    q: string
    filter: string
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
    slug: string | undefined
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
}
export interface AdListing {
    name: string | undefined
    contact: ContactComponent
    user: {}
    website: string | undefined
    ad_image?: {}
    step_number: number
}
export interface ImageParams {
    refId: string | any
    ref: string
    field: string
    imgData: any
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
    amenities: any[]
    property_details: RealEstateComponent
}
export interface RealEstateComponent {
    bathrooms: number
    direction: string
    floor_number: number
    total_floors: number
    carpet_area: number
    parking_type: string
    landmark: string
    rental_amount: number
    selling_amount: number
    deposit_amount: number
    furnishing: string
}