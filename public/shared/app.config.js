const currentDate = new Date().getTime();
const year = new Date().getFullYear();
const years = Array.from(new Array(20), (val, index) =>
  (year - index).toString()
);
module.exports = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
  BASE_URL: "https://www.chandapura.com",
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
    Pricing: {
      label: "Pricing",
      link: "/pricing",
    },
    BizCategoryList: {
      label: "Business Category List",
      link: "/business-category-list",
    },
    BannerAdGuidelines: {
      label: "Banner-Ad Guidelines",
      link: "/banner-ad-guidelines",
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
      searchFacets: [],
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
        // isPublishedFilter: `filters[publish_status][$eq]=true&filters[payment_details][expiry_date_timestamp][$gt]=${currentDate}`,
        isPublishedFilter: `filters[publish_status][$eq]=true`,
        listingTypeFilter: "filters[listing_type][$eq]=Sale",
        limit: 4,
        component: "real-estate.sale-property-details",
      },
    },
    rent: {
      label: "rent",
      productType: "real-estate-rent",
      searchIndex: "property-listing",
      searchFacets: [],
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
        // isPublishedFilter: `filters[publish_status][$eq]=true&filters[payment_details][expiry_date_timestamp][$gt]=${currentDate}`,
        isPublishedFilter: `filters[publish_status][$eq]=true`,
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
      searchFacets: [],
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
        // isPublishedFilter: `filters[publish_status][$eq]=true&filters[payment_details][expiry_date_timestamp][$gt]=${currentDate}`,
        isPublishedFilter: `filters[publish_status][$eq]=true`,
        listingTypeFilter: "filters[listing_type][$eq]=PG",
        limit: 4,
        component: "real-estate.pg-details",
      },
    },
    realEstate: {
      label: "real estate",
      productType: "real-estate",
      searchIndex: "property-listing",
      searchSuggestIndex: "area",
      searchFacets: [],
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
        // isPublishedFilter: `filters[publish_status][$eq]=true&filters[payment_details][expiry_date_timestamp][$gt]=${currentDate}`,
        isPublishedFilter: `filters[publish_status][$eq]=true`,
        limit: 4,
      },
    },
    business: {
      label: "business",
      productType: "business-listing",
      searchIndex: "business-listing",
      searchSuggestIndex: "sub-category",
      searchFacets: [],
      searchPageLimit: 10,
      slug: "business-categories",
      url: "business-categories",
      api: {
        base: "business-listings",
        sort: "desc",
        // populate:
        //   "populate[0]=sub_category&populate[1]=category&populate[2]=user&populate[3]=featured_image&populate[4]=area&populate[5]=gallery_images&populate[6]=contact",
        populateList: "sub_category,category,user,featured_image,area,contact",
        populateDetails: "*",
        populateForPayment: "payment_history,payment_details",
        userFilter: "filters[author][email][$eq]",
        // isPublishedFilter: `filters[publish_status][$eq]=true&filters[payment_details][expiry_date_timestamp][$gt]=${currentDate}`,
        isPublishedFilter: `filters[publish_status][$eq]=true`,
        limit: 4,
      },
    },
    classifieds: {
      label: "classified",
      productType: "classifieds",
      searchIndex: "classified-listing",
      searchSuggestIndex: "classified-category",
      searchFacets: [],
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
        componentVehicle: "classified.vehicle-details",
      },
    },
    job: {
      label: "job",
      productType: "job-vacancy",
      searchIndex: "job-listing",
      searchSuggestIndex: "job-title",
      searchFacets: ["work_mode", "job_type", "area"],
      slug: "job-vacancy",
      url: "job-vacancy",
      api: {
        base: "job-listings",
        sort: "desc",
        populateList:
          "logo_image,area,contact,preferred_languages,details_by_jobCategory",
        populateDetails:
          "logo_image,area,contact,preferred_languages,details_by_jobCategory",
        populateForPayment: "payment_history,payment_details",
        userFilter: "filters[author][email][$eq]",
        isPublishedFilter: `filters[publish_status][$eq]=true`,
        limit: 4,
        component_corporateJob: "job.corporate-job-details",
        component_personalJob: "job.personal-job-details",
      },
      personalJobUrl: "personal",
      corporateJobUrl: "corporate",
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
    termsConditions: {
      api: {
        base: "legal-document?fields=terms_conditions",
      },
    },
    privacyPolicy: {
      api: {
        base: "legal-document?fields=privacy_policy",
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
    SubCategory: {
      label: "sub-category",
      api: {
        base: "sub-categories",
        sort: "name:asc",
        populate: "category",
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
    Language: {
      label: "language",
      api: {
        base: "languages",
        sort: "id:asc",
      },
    },
    JobTitles: {
      label: "jobTitles",
      api: {
        base: "job-titles",
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
        populate:
          "populate=featured_image,payment_details,area,category,sub_category,advertisement",
        filter: "filters[author][email][$eq]",
      },
    },
    PropertyList: {
      label: "propertyList",
      api: {
        base: "property-listings",
        sortByName: "name:asc",
        sortByDate: "updatedAt:desc",
        populate: "populate=featured_image,payment_details,area",
        filter: "filters[author][email][$eq]",
      },
    },
    ClassifiedList: {
      label: "classifiedList",
      api: {
        base: "classified-listings",
        sortByName: "name:asc",
        sortByDate: "updatedAt:desc",
        populate: "populate=featured_image,payment_details,area,category",
        filter: "filters[author][email][$eq]",
      },
    },
    JobList: {
      label: "jobList",
      api: {
        base: "job-listings",
        sortByName: "job_title:asc",
        sortByDate: "updatedAt:desc",
        populate: "populate=logo_image,area,category",
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
  CatergorySection: {
    BizCategory: {
      searchIndex: "category",
    },
    ClassifiedCategory: {
      searchIndex: "classified-category",
    },
  },
  SelectList: {
    PropertyType: {
      Apartment: "Apartment",
      IndividualHouse: "Individual House",
      Villa: "Villa",
      Plot: "Plot",
      Pg: "PG",
    },
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
    AreaUnit: [
      "sqft",
      "sqyd",
      "acre",
      "gaj",
      "cent",
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
    JobType: [
      "Full-Time",
      "Part-Time",
      "Contract-Based",
      "Freelance",
      "Internship",
    ],
    EducationalQualification: [
      "Below 10th",
      "SSC/10th",
      "PUC/12th",
      "Diploma",
      "Graduate",
      "Post Graduate",
    ],
    JobLocation: [
      "Work from office (WFO)",
      "Work from home (WFH)",
      "Hybrid (WFO + WFH)",
      "Field Job",
    ],
    Gender: ["Male only", "Female only", "Any gender"],
    JobExperience: ["Fresher", "Experienced", "Any"],
    InterviewMode: ["In-Person", "Telephonic / Online"],
    YearOfExperience: [
      "6 Months",
      "1 Year",
      "2 Years",
      "3 Years",
      "5 Years",
      "10 Years",
    ],
    JobShift: [
      "General Shift",
      "Morning Shift",
      "Afternoon Shift",
      "Night Shift",
      "Rotational Shift",
    ],
    JobCategory: ["Corporate", "Personal"],
    Ordinals: [
      { number: "1", label: "First" },
      { number: "2", label: "Second" },
      { number: "3", label: "Third" },
      { number: "4", label: "Fourth" },
      { number: "5", label: "Fifth" },
    ],
  },
  PageLinks: {
    termsAndConditions: "/terms-and-conditions",
    privacyPolicy: "/privacy-policy",
  },
  CloudImages: {
    SideBannerBusiness:
      "https://assets.chandapura.com/Side_Banner_cc856072ef.png",
  },
};
