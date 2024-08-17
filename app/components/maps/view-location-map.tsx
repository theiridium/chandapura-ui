"use client"

const ViewLocationMap = ({ coordinates }: any) => {

  return (
    <iframe
      width="100%"
      height="450"
      className="rounded-lg"
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&hl=en&z=20&amp&output=embed`}
    >
    </iframe>
  );
};

export default ViewLocationMap;