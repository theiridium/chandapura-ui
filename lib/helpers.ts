import { Products } from "@/public/shared/app.config";
import { postRequestApi, putRequestApi } from "./apiLibrary";
import sub_cat from "@/lib/data/sub-category.json";
import slugify from 'react-slugify';
import imageCompression from 'browser-image-compression';
import { ActivityLog } from "./typings/enums";

export function IsProductUrl(val: string) {
  return Object.values(Products).some((product: any) => product.slug === val);
}

export function GetProductFromParam(val: string) {
  return Object.values(Products).find((x: any) => x.slug === val);
}

export function GetProductFromProductType(val: string): any {
  return Object.values(Products).find((x: any) => x.productType === val);
}
export function GetProductFromLabel(val: string): any {
  return Object.values(Products).find((x: any) => x.label === val.toLocaleLowerCase());
}

export function isEmptyObject(obj: Object) {
  return Object.keys(obj).length === 0;
}

export const GetFreeListingDaysRange = () => {
  const currentDate: any = new Date();
  //15 years from now 
  return new Date(currentDate.setFullYear(currentDate.getFullYear() + 15)).toISOString();
}
export const GetDateRangeMonthly = () => {
  const currentDate: any = new Date();
  return new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
}
export const GetOfferPeriodDateRangeMonthly = () => {
  const currentDate: any = new Date();
  return new Date(currentDate.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString();
}
export const GetOfferPeriodDateRangeQuaterly = () => {
  const currentDate: any = new Date();
  const newDate = new Date(currentDate);
  newDate.setMonth(newDate.getMonth() + 4);
  return newDate.toISOString();
}
export const GetOfferPeriodDateRangeHalfYearly = () => {
  const currentDate: any = new Date();
  const newDate = new Date(currentDate);
  newDate.setMonth(newDate.getMonth() + 8);
  return newDate.toISOString();
}
export const GetOfferPeriodDateRangeYearly = () => {
  const currentDate: any = new Date();
  const newDate = new Date(currentDate);
  newDate.setFullYear(newDate.getFullYear() + 1);
  newDate.setMonth(newDate.getMonth() + 3);
  return newDate.toISOString();
}

export const GetDaysToExpire = (futureDate: any) => {
  const currentDate: any = new Date();
  const targetDate: any = new Date(futureDate);

  const timeDiff = targetDate - currentDate;
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  return Math.max(daysLeft, 0);
};

export const GenerateItemNameForInvoice = (planLabel: string, subscriptionType: string, propertyData: string) => {
  let itemName = planLabel + " - " + subscriptionType + " Subscription";
  if (!!propertyData) itemName = itemName + " - " + propertyData;
  return itemName;
}

export const GetOrdinal = (num: number) => {
  if (num % 100 >= 11 && num % 100 <= 13) {
    return num + "th";
  }

  const suffixes = ["th", "st", "nd", "rd"];
  const lastDigit = num % 10;

  return num + (suffixes[lastDigit] || "th");
}

export const CreateActivityLogPayload = (logItem: ActivityLog) => {
  const currentDate = new Date();
  return [{
    event: logItem,
    processed: currentDate.toISOString()
  }]
}

export const CompressAndConvertToWebP = async (file: any) => {
  const options = {
    fileType: 'image/webp',
    useWebWorker: true,
  };
  return await imageCompression(file, options);
};

export const ConvertToWebP = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const fileType = file.type.toLowerCase();

    // Skip converting if already WebP or HEIC
    if (fileType === "image/webp" || fileType.includes("heic") || fileType.includes("heif")) {
      return resolve(file);
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      img.src = reader.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Failed to get canvas context");

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("WebP conversion failed");

          const webpFile = new File(
            [blob],
            file.name.replace(/\.\w+$/, ".webp"),
            {
              type: "image/webp",
              lastModified: Date.now(),
            }
          );

          resolve(webpFile);
        },
        "image/webp",
        1
      );
    };

    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function ConvertCurrencyToWords(x: number) {
  if (x) {
    const num = x.toString();
    const numArr = Array.from(num);
    let count = num.length;
    switch (count) {
      case 6:
        if (Number(numArr[1]) === 0) return `${numArr[0]} Lac`;
        else return `${numArr[0]}.${numArr[1]} Lacs`;
      case 7:
        return `${numArr[0]}${numArr[1]} Lacs`;
      case 8:
        if (Number(numArr[1]) === 0) return `${numArr[0]} Cr`;
        else return `${numArr[0]}.${numArr[1]} Cr`;
      case 8:
        return `${numArr[0]}${numArr[1]} Cr`;
      case 9:
        return `${numArr[0]}${numArr[1]}${numArr[2]} Cr`;
      default:
        return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(x)
    }
  }
}

export function CalculateExpiryDate(date: any, months: number) {
  const expiryDate = new Date(date);
  expiryDate.setMonth(expiryDate.getMonth() + months);
  return expiryDate.toISOString();
}

export function ConvertToReadableDate(date: any) {
  const options: any = { day: '2-digit', month: 'short', year: 'numeric' };
  const dateStr = date.toLocaleDateString('en-US', options)
  return dateStr;
}

export function HashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(36);
}

export function CheckSubscriptionValidity(expiryDateTmestamp: any, isPaymentSuccess: boolean) {
  const currentDateTimestamp = new Date().getTime();
  if (expiryDateTmestamp >= currentDateTimestamp && isPaymentSuccess) {
    return true;
  }
  else return false;
}

export function CalculateDiscountPercentage(originalPrice: number, discountedPrice: number) {
  let discount = originalPrice - discountedPrice;
  let discountPercentage = (discount / originalPrice) * 100;
  return Math.floor(discountPercentage);
}

let subcat = ["Banks", "Govt Dispensary", "BESCOM", "Post Office", "Petrol Bunk", "Old-Age Home", "Chandapura Municipality Corporation", "Panchayat Office", "Chandapura  Federation", "Veterinary Hospital", "Orphanage", "Fire Station", "Temple", "Cooking Gas Agency", "Gents Tailor", "Ladies & Kids Boutique", "Builder & Developer", "Real Estate Agent", "Flats For Rent", "Flats For Sale", "Individual House  Rent", "Individual House  Sale", "Used Car Sale", "Used Bike Sale", "Used Electronics Sale", "Used House Hold Materials Sale", "Individual Plot Sale", "Commercial Property  Sale", "Used Furniture Sale", "Car Repair", "Bike & Motor Cycle Repair", "Cycle Shop & Repair", "Tyre Shop", "Puncture Shop", "Car Body Painting Shop", "Driving School", "Bike Showroom", "Car Showroom", "Car & Bike Water Washing", "Primary School", "Higher Secondary School", "PU & Degree College", "Kindergarten", "Play School", "Day Care", "Coaching Institute", "Veg Hotel", "Veg Restaurant", "Non-veg & Veg Restaurant", "Coffee Shop", "Juice & Snacks Bar", "Food On Wheels", "Chat Centre", "Bakery", "Sweet Shop", "Bar & Restaurant", "Food Catering", "Pan Shop", "Cake Shop", "Chicken Centre", "Mutton Centre", "Chicken & Mutton Centre", "Fish Centre", "Chicken , Mutton & Fish Centre", "Pork Centre", "Departmental Store", "Fruit Shop", "Groccery Store", "Milk Supplier", "Pooja Items", "Drinking Water Supplier", "News Paper Agency", "Vegetable Shop", "Furniture Store", "Hardware Store", "Tiles & Sanitary Store", "Modular Kitchen", "Architects & Interior Designer", "Flower Nursery", "Welding & Aluminium Fabricator", "Building Material ( Cement & Iron)", "Photo Frame Shop", "Courier Service", "Dry Cleaning & Laundry", "Cable Tv & Internet Service Provider", "Water Tanker", "Art Work", "Duplicate Key Makers", "Insurance Agent", "Web Designer", "Auto Rikshaw Services", "Lawyer", "Security Manpower Agencies", "Music Class", "Carpenter", "Event Management", "Painter", "Plumber", "Electrician", "Stp Operator", "Gardener", "Swimming Pool Operator", "Driver", "House Keeping Service", "Packers & Movers", "Flower Decorators", "Masions", "Photo Studio", "Watch Sales & Repair", "Pest Control", "Borewell Motor Repair", "Civil Contractor", "Dance Class", "Children Hospital", "Multi Speciality Hospital", "Eye Clinic", "Gym & Fitness Centre", "Diagnostics Centre", "Homeopathy Clinic", "Ayurvedic Clinic", "Dental Clinic", "Pharmacy", "Sports Club", "Optical Store", "Beauty Parlour - Women & Kids", "Saloon- Men", "Saloon - Unisex", "Beauty Parlour At Home", "Spa", "Bridal Makeup", "Wedding & Convention Centre", "Tent House", "Jwellery Store", "Mobile Sales & Repair Centre", "Electrical Sales & Reapir", "Electronics Sales & Reapir", "Taxi For Hire", "Travel Agent", "Ticket ( Flight , Train , Bus)", "Lodging & Boarding", "Pet Shop", "Printing & Stickering", "Agriculture Product  Supplier", "Clothing &  Apparel Store", "Toys & Gifts Store", "E- Stamp Paper Sales", "Fancy Store", "PG Accommodation", "Pujari", "Recruitment"];
// let subcat = ["Banks"];
function JSONToCSV(jsonData: any) {
  if (jsonData.length === 0) {
    return ''; // Return empty string if no data provided
  }

  const headers = Object.keys(jsonData[0]);
  let csv = headers.join(',') + '\n'; // Header row

  jsonData.forEach((item: any) => {
    csv += headers.map(header => {
      return item[header];
    }).join(',') + '\n';
  });

  return csv;
}
export async function UploadSubCategories() {
  const endpoint = "sub-categories";
  let result: any[] = []
  let promises: Promise<any>[] = [];
  // console.log(sub_cat)
  sub_cat.forEach(e => {
    const promise = postRequestApi(endpoint, e)
      .then(res => {
        if (res.data) {
          let id = res.data.id;
          let name = res.data.name;
          result.push({ id, name });
        }
      })
      .catch(err => console.error(err));
    promises.push(promise);
  });

  await Promise.all(promises);

  console.log(result);
  let csvData = JSONToCSV(result);
  var blob = new Blob([csvData], {
    type: "text/csv;charset=utf-8",
  });

  // Create a link element
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = "sample.csv"; // Set the file name here

  // Append the link to the body
  document.body.appendChild(link);

  // Programmatically click the link to trigger the download
  link.click();

  // Clean up
  document.body.removeChild(link);
}

export async function UpdateSubCategories() {
  const endpoint = "sub-categories";
  let result: any[] = []
  let promises: Promise<any>[] = [];
  sub_cat.forEach(e => {
    const payload = {
      "slug": slugify(e.name)
    }
    console.log(payload)
    const promise = putRequestApi(endpoint, payload, e.id)
      .then(res => {
        if (res.data) {
          let id = res.data.id;
          let name = res.data.name;
          result.push({ id, name });
        }
      })
      .catch(err => console.error(err));
    promises.push(promise);
  });
  await Promise.all(promises);
  console.log(result);
}