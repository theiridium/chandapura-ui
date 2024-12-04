const currentDate = new Date().getTime();
module.exports = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
  Resource: {
    BusinessListing: {
      label: "Business Listing",
      dashboardLink: "/dashboard/business-listing/view-all",
      userLabel: "My Listing",
      baseLink: "/dashboard/business-listing",
      addDetailsLink: "/dashboard/business-listing/add-details",
      uploadImagesLink: "/dashboard/business-listing/upload-images",
    },
    PropertyListing: {
      label: "Property Listing",
      dashboardLink: "/dashboard/property-listing/view-all",
      userLabel: "My Listings",
      baseLink: "/dashboard/property-listing",
      addDetailsLink: "/dashboard/property-listing/add-details",
      uploadImagesLink: "/dashboard/property-listing/upload-images",
    },
    Classifieds: {
      label: "Classifieds",
      dashboardLink: "/dashboard/advertise/view-all",
      userLabel: "My Advertisements",
      baseLink: "/dashboard/advertise",
      addDetailsLink: "/dashboard/advertise/add-details",
      uploadImagesLink: "/dashboard/advertise/upload-images",
    },
    JobListing: {
      label: "Job Listing",
      dashboardLink: "/dashboard/advertise/view-all",
      userLabel: "My Advertisements",
      baseLink: "/dashboard/advertise",
      addDetailsLink: "/dashboard/advertise/add-details",
      uploadImagesLink: "/dashboard/advertise/upload-images",
    },
    Advertisement: {
      label: "Banner Ad",
      dashboardLink: "/dashboard/advertise/view-all",
      userLabel: "My Advertisements",
      baseLink: "/dashboard/advertise",
      addDetailsLink: "/dashboard/advertise/add-details",
      uploadImagesLink: "/dashboard/advertise/upload-images",
    },
    Dashboard: {
      label: "Dashboard",
      link: "/dashboard",
    },
    MyProfile: {
      label: "My Profile",
      link: "/",
    },
    Login: {
      label: "Log In",
      link: "/login",
    },
    Logout: {
      label: "Logout",
      link: "/",
    },
  },
  ProductSelect: [
    {
      label: "Business",
      value: "business-listing",
    },
    {
      label: "Real Estate",
      value: "real-estate",
    },
    {
      label: "Job Vacancy",
      value: "job-vacancy",
    },
    {
      label: "Classifieds",
      value: "classifieds",
    },
  ],
  Products: {
    sale: {
      label: "sale",
      productType: "real-estate-sale",
      searchIndex: "real-estate",
      slug: "property-for-sale",
      url: "real-estate/property-for-sale",
      api: {
        base: "real-estates",
        sort: "desc",
        populateList: "property_details,featured_image,area,contact,amenities",
        populateDetails:
          "property_details,featured_image,area,gallery_images,contact,amenities",
        limit: 4,
        userFilter: "filters[author][email][$eq]",
        isPublishedFilter: `filters[publish_status][$eq]=true&filters[payment_details][expiry_date_timestamp][$gt]=${currentDate}`,
        listingTypeFilter: "filters[listing_type][$eq]=Sale",
        limit: 4,
      },
    },
    rent: {
      label: "rent",
      productType: "real-estate-rent",
      searchIndex: "real-estate",
      slug: "property-for-rent",
      url: "real-estate/property-for-rent",
      api: {
        base: "real-estates",
        sort: "desc",
        populateList: "property_details,featured_image,area,contact,amenities",
        populateDetails:
          "property_details,featured_image,area,gallery_images,contact,amenities",
        userFilter: "filters[author][email][$eq]",
        isPublishedFilter: `filters[publish_status][$eq]=true&filters[payment_details][expiry_date_timestamp][$gt]=${currentDate}`,
        listingTypeFilter: "filters[listing_type][$eq]=Rent",
        limit: 4,
      },
    },
    realEstate: {
      label: "real estate",
      productType: "real-estate",
      searchIndex: "real-estate",
      url: "real-estate",
      api: {
        base: "real-estates",
        sort: "desc",
        populateList: "property_details,featured_image,area,contact,amenities",
        populateDetails:
          "property_details,featured_image,area,gallery_images,contact,amenities",
        userFilter: "filters[author][email][$eq]",
        isPublishedFilter: `filters[publish_status][$eq]=true&filters[payment_details][expiry_date_timestamp][$gt]=${currentDate}`,
        limit: 4,
      },
    },
    business: {
      label: "business",
      productType: "business-listing",
      searchIndex: "business-listing",
      slug: "business-categories",
      url: "business-categories",
      api: {
        base: "business-listings",
        sort: "desc",
        populate:
          "populate[0]=sub_category&populate[1]=category&populate[2]=user&populate[3]=featured_image&populate[4]=area&populate[5]=gallery_images&populate[6]=contact",
        userFilter: "filters[author][email][$eq]",
        isPublishedFilter: `filters[publish_status][$eq]=true&filters[payment_details][expiry_date_timestamp][$gt]=${currentDate}`,
        limit: 4,
      },
    },
    job: {
      label: "job",
      productType: "job-vacancy",
      path: "job-vaccancy",
      url: "/job-vaccancy",
      api: {
        base: "properties",
        sort: "desc",
        populate: "",
        limit: 4,
      },
    },
    advertisement: {
      label: "advertisement",
      productType: "advertisement",
      path: "advertisement",
      url: "/advertisement",
      api: {
        base: "advertisements",
        sort: "desc",
        populate: "populate[0]=ad_image&populate[1]=ad_contact",
        filter: "filters[payment_details][expiry_date][$gt]",
        limit: 0,
        userFilter: "filters[author][email][$eq]",
        isPublishedFilter: `filters[publish_status][$eq]=true&filters[payment_details][expiry_date_timestamp][$gt]=${currentDate}`,
      },
    },
    pricingPlan: {
      api: {
        base: "pricing-plans?filters[name][$eq]",
      },
    },
    businessListingPricingPlan: {
      api: {
        base: "business-listing-pricing-plan",
      },
    },
    realEstatePricingPlan: {
      api: {
        base: "real-estate-pricing-plan",
      },
    },
    advertisementPricingPlan: {
      api: {
        base: "advertisement-pricing-plan",
      },
    },
  },
  DropdownList: {
    Amenities: {
      label: "amenities",
      api: {
        base: "real-estate-amenities",
        sort: "name:asc",
      },
    },
    Category: {
      label: "category",
      api: {
        base: "categories",
        sort: "name:asc",
        populate: "sub_categories",
      },
    },
    Area: {
      label: "area",
      api: {
        base: "areas",
        sort: "name:asc",
      },
    },
    ContactList: {
      label: "contactList",
      api: {
        base: "contact-lists",
        sort: "full_name:asc",
        filter: "filters[author][email][$eq]",
      },
    },
    BusinessList: {
      label: "businessList",
      api: {
        base: "business-listings",
        sortByName: "name:asc",
        sortByDate: "updatedAt:desc",
        filter: "filters[author][email][$eq]",
      },
    },
    PropertyList: {
      label: "propertyList",
      api: {
        base: "real-estates",
        sortByName: "name:asc",
        sortByDate: "updatedAt:desc",
        filter: "filters[author][email][$eq]",
      },
    },
    AdvertisementList: {
      label: "advertisementList",
      api: {
        base: "advertisements",
        sortByName: "name:asc",
        sortByDate: "updatedAt:desc",
        filter: "filters[author][email][$eq]",
      },
    },
  },
  SelectList: {
    PropertyTypeRent: ["Apartment", "Individual", "Villa", "PG"],
    PropertyTypeSale: ["Apartment", "Individual", "Villa", "Plot"],
    Direction: [
      "East",
      "West",
      "North",
      "South",
      "North-East",
      "South-East",
      "North-West",
      "South-West",
    ],
    Furnishhing: ["Semi Furnished", "Fully Furnished", "Non Furnished"],
    ParkingType: ["Open", "Covered"],
    RoomType: ["Studio", "1BHK", "2BHK", "3BHK", "4BHK", "5BHK"],
  },
};
