export interface ApiFilter {
    base: string;
    sort: string;
    populate: string;
    limit: number;
}
export interface SearchPayload
{
    indexUid: string;
    q: string;
}
export interface SingleItemData
{
    id: any;
    data: {};
    pagination: any;
}
export interface RealEstate
{
    id: any;
    data: any;
    listing_manager: any;
    pagination: any;
}
export interface ContactList {
    full_name: string,
    phone: string | any,
    email_id: string,
}
export interface BusinessHours {
    day: string,
    open_time: Set<string>,
    close_time: Set<string>,
    isOpen: boolean
}
export interface BusinessListing {
    area: any,
    name: string | undefined,
    full_address: string | undefined,
    description: string | undefined,
    contact_email_id: string | any,
    contact_name: string | any,
    contact_number: string | any,
    user: {},
    slug: string | undefined,
    tags: string | undefined,
    sub_category: string | undefined,
    gallery_images?: any[],
    category: string | undefined,
    website: string | undefined,
    services: any[],
    bus_hours: BusinessHours[] | any,
    featured_image?: {},
    step_number: number,
    location: any
}
export interface ImageParams {
    refId: string | any,
    ref: string,
    field: string,
    imgData: any
}