import { Products } from "@/public/shared/app.config";
import { postRequestApi, putRequestApi } from "./apiLibrary";
import sub_cat from "@/lib/data/sub-category.json";
import slugify from 'react-slugify';

export function IsProductUrl(val: string) {
  return Object.values(Products).some((product: any) => product.slug === val);
}

export function GetProductFromParam(val: string) {
  return Object.values(Products).find((x: any) => x.slug === val);
}

export function GetProductFromProductType(val: string) {
  return Object.values(Products).find(x => x.productType === val);
}

export function isEmptyObject(obj: Object) {
  return Object.keys(obj).length === 0;
}

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