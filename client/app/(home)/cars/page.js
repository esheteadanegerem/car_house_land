"use client";
import React from "react";
import Image from "next/image";

const cars = [
  {
    id: 1,
    name: "Toyota Corolla",
    year: 2022,
    price: "$18,000",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDWedaVXpmr-K-79LZBSUv5kwsY11VBFI7Dw&s",
    description: "Reliable and fuel efficient sedan.",
  },
  {
    id: 2,
    name: "Honda Civic",
    year: 2021,
    price: "$17,500",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3a_HC5XUKgOoMcKly_uTrEcutVjSn_1pEnQ&s",
    description: "Sporty look with advanced safety features.",
  },
  {
    id: 3,
    name: "Ford Mustang",
    year: 2023,
    price: "$32,000",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    description: "Classic American muscle car.",
  },
];

const CarsPage = () => {
  return (
    <main className="container mx-auto p-4">
      <h2 className="text-center mb-6 font-bold text-2xl">Available Cars</h2>

      {/* Flex container */}
      <div className="flex flex-wrap gap-4 justify-center">
        {cars.map((car) => (
          <div
            key={car.id}
            className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden w-full sm:w-[48%] lg:w-[31%]"
          >
            <Image
              src={car.image}
              alt={car.name}
              width={400}
              height={200}
              className="object-cover h-48 w-full"
              unoptimized
            />
            <div className="flex flex-col p-4 flex-1">
              <h5 className="font-semibold text-lg mb-1">
                {car.name}{" "}
                <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {car.year}
                </span>
              </h5>
              <p className="text-sm text-gray-500">{car.description}</p>
              <div className="mt-auto pt-3">
                <span className="font-bold text-blue-600">{car.price}</span>
                <button className="mt-2 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition">
                  Contact Seller
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default CarsPage;
