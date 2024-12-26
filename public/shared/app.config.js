const currentDate = new Date().getTime();
const year = (new Date()).getFullYear();
const years = Array.from(new Array(20),( val, index) => (year - index).toString());
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
      userLabel: "My Businesess",
      baseLink: "/dashboard/business-listing",
      addDetailsLink: "/dashboard/business-listing/add-details",
      uploadImagesLink: "/dashboard/business-listing/upload-images",
    },
    PropertyListing: {
      label: "Property Listing",
      dashboardLink: "/dashboard/property-listing/view-all",
      userLabel: "My Properties",
      baseLink: "/dashboard/property-listing",
      addDetailsLink: "/dashboard/property-listing/add-details",
      uploadImagesLink: "/dashboard/property-listing/upload-images",
    },
    ClassifiedListing: {
      label: "Classifieds",
      dashboardLink: "/dashboard/classified-listing/view-all",
      userLabel: "My Classifieds",
      baseLink: "/dashboard/classified-listing",
      addDetailsLink: "/dashboard/classified-listing/add-details",
      uploadImagesLink: "/dashboard/classified-listing/upload-images",
    },
    JobListing: {
      label: "Job Listing",
      dashboardLink: "/dashboard/job-listing/view-all",
      userLabel: "My Job Listings",
      baseLink: "/dashboard/job-listing",
      addDetailsLink: "/dashboard/job-listing/add-details",
      uploadImagesLink: "/dashboard/job-listing/upload-images",
    },
    Advertisement: {
      label: "Banner Ads",
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
      label: "Classifieds",
      value: "classifieds",
    },
    {
      label: "Job Vacancy",
      value: "job-vacancy",
    },
  ],
  Products: {
    sale: {
      label: "sale",
      productType: "real-estate-sale",
      searchIndex: "property-listing",
      slug: "property-for-sale",
      url: "real-estate/property-for-sale",
      api: {
        base: "property-listings",
        sort: "desc",
        populateList:
          "featured_image,area,contact,details_by_listingtype.amenities,details_by_listingtype.occupancy_type",
        populateDetails:
          "featured_image,area,gallery_images,contact,details_by_listingtype.amenities,details_by_listingtype.occupancy_type",
        limit: 4,
        userFilter: "filters[author][email][$eq]",
        isPublishedFilter: `filters[publish_status][$eq]=true&filters[payment_details][expiry_date_timestamp][$gt]=${currentDate}`,
        listingTypeFilter: "filters[listing_type][$eq]=Sale",
        limit: 4,
        component: "real-estate.sale-property-details",
      },
    },
    rent: {
      label: "rent",
      productType: "real-estate-rent",
      searchIndex: "property-listing",
      slug: "property-for-rent",
      url: "real-estate/property-for-rent",
      api: {
        base: "property-listings",
        sort: "desc",
        populateList:
          "featured_image,area,contact,details_by_listingtype.amenities,details_by_listingtype.occupancy_type",
        populateDetails:
          "featured_image,area,gallery_images,contact,details_by_listingtype.amenities,details_by_listingtype.occupancy_type",
        userFilter: "filters[author][email][$eq]",
        isPublishedFilter: `filters[publish_status][$eq]=true&filters[payment_details][expiry_date_timestamp][$gt]=${currentDate}`,
        listingTypeFilter: "filters[listing_type][$eq]=Rent",
        limit: 4,
        component: "real-estate.rent-property-details",
      },
    },
    plot: {
      label: "plot",
      api: {
        component: "real-estate.plot-details",
      },
    },
    pg: {
      label: "pg",
      productType: "real-estate-pg",
      searchIndex: "property-listing",
      slug: "pg-accomodations",
      url: "real-estate/pg-accomodations",
      api: {
        base: "property-listings",
        sort: "desc",
        populateList:
          "featured_image,area,contact,details_by_listingtype.amenities,details_by_listingtype.occupancy_type",
        populateDetails:
          "featured_image,area,gallery_images,contact,details_by_listingtype.amenities,details_by_listingtype.occupancy_type",
        userFilter: "filters[author][email][$eq]",
        isPublishedFilter: `filters[publish_status][$eq]=true&filters[payment_details][expiry_date_timestamp][$gt]=${currentDate}`,
        listingTypeFilter: "filters[listing_type][$eq]=PG",
        limit: 4,
        component: "real-estate.pg-details",
      },
    },
    realEstate: {
      label: "real estate",
      productType: "real-estate",
      searchIndex: "property-listing",
      url: "real-estate",
      api: {
        base: "property-listings",
        sort: "desc",
        populateList:
          "featured_image,area,contact,details_by_listingtype.amenities,details_by_listingtype.occupancy_type",
        populateDetails:
          "featured_image,area,gallery_images,contact,details_by_listingtype.amenities,details_by_listingtype.occupancy_type",
        populateForPayment:
          "details_by_listingtype.amenities,details_by_listingtype.occupancy_type,payment_history,payment_details",
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
    classifieds: {
      label: "classified",
      productType: "classifieds",
      searchIndex: "classified-listing",
      slug: "classifieds",
      url: "classifieds",
      api: {
        base: "classified-listings",
        sort: "desc",
        populateList:
          "featured_image,area,contact,category,details_by_category",
        populateDetails:
          "featured_image,area,gallery_images,contact,category,details_by_category",
        populateForPayment:
          "details_by_category,payment_history,payment_details",
        userFilter: "filters[author][email][$eq]",
        isPublishedFilter: `filters[publish_status][$eq]=true`,
        limit: 4,
      },
    },
    job: {
      label: "job",
      productType: "job-vacancy",
      searchIndex: "job-listing",
      slug: "job-vacancy",
      url: "job-vacancy",
      api: {
        base: "job-listings",
        sort: "desc",
        populate:
          "populate[0]=user&populate[1]=featured_image&populate[2]=area&populate[3]=contact",
        userFilter: "filters[author][email][$eq]",
        isPublishedFilter: `filters[publish_status][$eq]=true`,
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
    RealEstateAmenities: {
      label: "real estate amenities",
      api: {
        base: "real-estate-amenities",
        sort: "name:asc",
      },
    },
    PGAmenities: {
      label: "pg amenities",
      api: {
        base: "pg-amenities",
        sort: "name:asc",
      },
    },
    PlotAmenities: {
      label: "plot amenities",
      api: {
        base: "plot-amenities",
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
    ClassifiedCategory: {
      label: "classifiedCategory",
      api: {
        base: "classified-categories",
        sort: "name:asc",
        populate: "*",
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
        base: "property-listings",
        sortByName: "name:asc",
        sortByDate: "updatedAt:desc",
        filter: "filters[author][email][$eq]",
      },
    },
    ClassifiedList: {
      label: "classifiedList",
      api: {
        base: "classified-listings",
        sortByName: "name:asc",
        sortByDate: "updatedAt:desc",
        filter: "filters[author][email][$eq]",
      },
    },
    JobList: {
      label: "jobList",
      api: {
        base: "job-listings",
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
    PropertyType: ["Apartment", "Individual House", "Villa", "Plot", "PG"],
    // PropertyTypeSale: ["Apartment", "Individual House", "Villa", "Plot"],
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
    RoomType: ["Studio", "1BHK", "2BHK", "3BHK", "4BHK", "5BHK", "5BHK+"],
    OccupancyType: [
      { label: "Single Room", name: "single_room" },
      { label: "Twin Sharing", name: "twin_sharing" },
      { label: "Triple Sharing", name: "triple_sharing" },
      { label: "Four Sharing", name: "four_sharing" },
    ],
    FuelType: ["Petrol", "Diesel", "Electric", "CNG", "Hybrid"],
    VehicleTransmission: ["Manual", "Automatic"],
    YearList: years,
    //job title
  },
};