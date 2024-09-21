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
    Advertisement: {
      label: "Advertise",
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
      productType: "real-estate",
      slug: "property-for-sale",
      url: "real-estate/property-for-sale",
      api: {
        base: "real-estates",
        sort: "desc",
        populate: "",
        limit: 4,
      },
    },
    rent: {
      label: "rent",
      productType: "real-estate",
      slug: "property-for-rent",
      url: "real-estate/property-for-rent",
      api: {
        base: "real-estates",
        sort: "desc",
        populate: "",
        limit: 4,
      },
    },
    business: {
      label: "business",
      productType: "business-listing",
      slug: "business-categories",
      url: "business-categories",
      api: {
        base: "business-listings",
        sort: "desc",
        populate: "populate[0]=sub_category&populate[1]=category&populate[2]=user&populate[3]=featured_image&populate[4]=bus_contact&populate[5]=gallery_images&populate[6]=contact",
        limit: 4,
        userFilter: "filters[author][email][$eq]",
        isPublishedFilter: "filters[publish_status][$eq]=true",
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
        isPublishedFilter: "filters[publish_status][$eq]=true",
      },
    },
    pricingPlanByType: "pricing-plans?filters[name][$eq]"
  },
  DropdownList: {
    Category: {
      label: "category",
      api: {
        base: "categories",
        sort: "name:asc",
        populate: "sub_categories",
      },
    },
    Location: {
      label: "loacation",
      api: {
        base: "locations",
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
        sort: "name:asc",
        filter: "filters[author][email][$eq]",
      },
    },
    AdvertisementList: {
      label: "advertisementList",
      api: {
        base: "advertisements",
        sort: "name:asc",
        filter: "filters[author][email][$eq]",
      },
    }
  }
};
