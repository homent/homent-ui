import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    // Insert sample properties
    const sampleProperties = [
      {
        title: "2 BHK Flat in Koregaon Park",
        description:
          "Spacious 2 BHK apartment with modern amenities in the heart of Koregaon Park. Close to IT parks and shopping centers.",
        property_type: "apartment",
        listing_type: "rent",
        price: 35000,
        built_area: 1200,
        carpet_area: 1000,
        bedrooms: 2,
        bathrooms: 2,
        furnishing: "semi_furnished",
        parking: 1,
        possession_status: "ready_to_move",
        address: "Koregaon Park, Pune, Maharashtra",
        city: "Pune",
        state: "Maharashtra",
        amenities: ["Swimming Pool", "Gym", "Security", "Power Backup"],
        photos: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        ],
        status: "published",
      },
      {
        title: "3 BHK Villa in Baner",
        description:
          "Luxurious 3 BHK villa with garden and private parking. Perfect for families looking for spacious living.",
        property_type: "villa",
        listing_type: "resale",
        price: 12500000,
        built_area: 2500,
        carpet_area: 2200,
        bedrooms: 3,
        bathrooms: 3,
        furnishing: "unfurnished",
        parking: 2,
        possession_status: "ready_to_move",
        address: "Baner, Pune, Maharashtra",
        city: "Pune",
        state: "Maharashtra",
        amenities: ["Garden", "Security", "Club House", "Children Play Area"],
        photos: [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
        ],
        status: "published",
      },
      {
        title: "1 BHK Apartment in Whitefield",
        description:
          "Compact 1 BHK apartment perfect for young professionals. Located in IT hub with excellent connectivity.",
        property_type: "apartment",
        listing_type: "rent",
        price: 22000,
        built_area: 650,
        carpet_area: 550,
        bedrooms: 1,
        bathrooms: 1,
        furnishing: "fully_furnished",
        parking: 1,
        possession_status: "ready_to_move",
        address: "Whitefield, Bangalore, Karnataka",
        city: "Bangalore",
        state: "Karnataka",
        amenities: ["Gym", "Security", "Power Backup", "Elevator"],
        photos: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        ],
        status: "published",
      },
      {
        title: "New 2 BHK Project in Hinjewadi",
        description:
          "Brand new 2 BHK apartments in upcoming project. Modern amenities and great investment opportunity.",
        property_type: "apartment",
        listing_type: "new",
        price: 8500000,
        built_area: 1100,
        carpet_area: 950,
        bedrooms: 2,
        bathrooms: 2,
        furnishing: "unfurnished",
        parking: 1,
        possession_status: "under_construction",
        address: "Hinjewadi, Pune, Maharashtra",
        city: "Pune",
        state: "Maharashtra",
        amenities: ["Swimming Pool", "Gym", "Club House", "Security", "Garden"],
        photos: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
        ],
        status: "published",
      },
      {
        title: "Commercial Office Space in Connaught Place",
        description:
          "Prime commercial office space in the heart of Delhi. Perfect for businesses and startups.",
        property_type: "office",
        listing_type: "rent",
        price: 150000,
        built_area: 2000,
        carpet_area: 1800,
        bedrooms: 0,
        bathrooms: 2,
        furnishing: "unfurnished",
        parking: 3,
        possession_status: "ready_to_move",
        address: "Connaught Place, New Delhi, Delhi",
        city: "New Delhi",
        state: "Delhi",
        amenities: ["Security", "Power Backup", "Elevator", "Conference Room"],
        photos: [
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
        ],
        status: "published",
      },
      {
        title: "4 BHK Independent House in Jayanagar",
        description:
          "Spacious 4 BHK independent house with terrace garden. Traditional architecture with modern amenities.",
        property_type: "independent_house",
        listing_type: "resale",
        price: 18500000,
        built_area: 3200,
        carpet_area: 2800,
        bedrooms: 4,
        bathrooms: 4,
        furnishing: "semi_furnished",
        parking: 2,
        possession_status: "ready_to_move",
        address: "Jayanagar, Bangalore, Karnataka",
        city: "Bangalore",
        state: "Karnataka",
        amenities: ["Garden", "Terrace", "Security", "Power Backup"],
        photos: [
          "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
        ],
        status: "published",
      },
    ];

    for (const property of sampleProperties) {
      const result = await sql`
        INSERT INTO properties (
          title, description, property_type, listing_type, price,
          built_area, carpet_area, bedrooms, bathrooms, furnishing,
          parking, possession_status, address, city, state,
          amenities, photos, status
        ) VALUES (
          ${property.title}, ${property.description}, ${property.property_type},
          ${property.listing_type}, ${property.price}, ${property.built_area},
          ${property.carpet_area}, ${property.bedrooms}, ${property.bathrooms},
          ${property.furnishing}, ${property.parking}, ${property.possession_status},
          ${property.address}, ${property.city}, ${property.state},
          ${property.amenities}, ${property.photos}, ${property.status}
        ) RETURNING id
      `;

      const propertyId = result[0].id;

      // Add listing-specific data
      if (property.listing_type === "rent") {
        await sql`
          INSERT INTO rent_properties (
            property_id, rent_amount, deposit, tenure_min_months
          ) VALUES (
            ${propertyId}, ${property.price}, ${property.price * 2}, 11
          )
        `;
      } else if (property.listing_type === "new") {
        await sql`
          INSERT INTO new_properties (
            property_id, builder_name, completion_date
          ) VALUES (
            ${propertyId}, 'Sample Builder', '2025-12-31'
          )
        `;
      } else if (property.listing_type === "resale") {
        await sql`
          INSERT INTO resale_properties (
            property_id, ownership_type, previous_owners
          ) VALUES (
            ${propertyId}, 'freehold', 1
          )
        `;
      }
    }

    return Response.json({
      success: true,
      message: `${sampleProperties.length} sample properties added successfully`,
    });
  } catch (error) {
    console.error("Error seeding data:", error);
    return Response.json({ error: "Failed to seed data" }, { status: 500 });
  }
}
