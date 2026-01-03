import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const listingType = searchParams.get("listingType");
    const propertyType = searchParams.get("propertyType");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const bedrooms = searchParams.get("bedrooms");
    const city = searchParams.get("city");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit")) || 20;
    const offset = parseInt(searchParams.get("offset")) || 0;

    let query = `
      SELECT 
        p.id, p.title, p.description, p.property_type, p.listing_type,
        p.price, p.built_area, p.carpet_area, p.bedrooms, p.bathrooms,
        p.furnishing, p.parking, p.possession_status, p.address,
        p.city, p.state, p.amenities, p.photos, p.created_at,
        CASE 
          WHEN p.listing_type = 'rent' THEN rp.rent_amount
          ELSE p.price
        END as display_price
      FROM properties p
      LEFT JOIN rent_properties rp ON p.id = rp.property_id
      WHERE p.status = 'published'
    `;

    const params = [];
    let paramIndex = 1;

    if (listingType) {
      query += ` AND p.listing_type = $${paramIndex}`;
      params.push(listingType);
      paramIndex++;
    }

    if (propertyType) {
      query += ` AND p.property_type = $${paramIndex}`;
      params.push(propertyType);
      paramIndex++;
    }

    if (minPrice) {
      query += ` AND (
        CASE 
          WHEN p.listing_type = 'rent' THEN rp.rent_amount >= $${paramIndex}
          ELSE p.price >= $${paramIndex}
        END
      )`;
      params.push(parseFloat(minPrice));
      paramIndex++;
    }

    if (maxPrice) {
      query += ` AND (
        CASE 
          WHEN p.listing_type = 'rent' THEN rp.rent_amount <= $${paramIndex}
          ELSE p.price <= $${paramIndex}
        END
      )`;
      params.push(parseFloat(maxPrice));
      paramIndex++;
    }

    if (bedrooms) {
      if (bedrooms === "4") {
        query += ` AND p.bedrooms >= $${paramIndex}`;
        params.push(4);
      } else {
        query += ` AND p.bedrooms = $${paramIndex}`;
        params.push(parseInt(bedrooms));
      }
      paramIndex++;
    }

    if (city) {
      query += ` AND LOWER(p.city) LIKE LOWER($${paramIndex})`;
      params.push(`%${city}%`);
      paramIndex++;
    }

    if (search) {
      query += ` AND (
        LOWER(p.title) LIKE LOWER($${paramIndex}) OR
        LOWER(p.description) LIKE LOWER($${paramIndex}) OR
        LOWER(p.address) LIKE LOWER($${paramIndex}) OR
        LOWER(p.city) LIKE LOWER($${paramIndex})
      )`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const properties = await sql(query, params);

    return Response.json({ properties });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return Response.json(
      { error: "Failed to fetch properties" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "propertyType",
      "listingType",
      "price",
      "address",
      "city",
      "state",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return Response.json(
          { error: `${field} is required` },
          { status: 400 },
        );
      }
    }

    // Insert property
    const result = await sql`
      INSERT INTO properties (
        partner_id, title, description, property_type, listing_type,
        price, built_area, carpet_area, plot_area, bedrooms, bathrooms,
        furnishing, parking, floor_number, total_floors, year_built,
        possession_status, address, latitude, longitude, city, state,
        amenities, photos, floor_plans
      ) VALUES (
        ${data.partnerId || null}, ${data.title}, ${data.description},
        ${data.propertyType}, ${data.listingType}, ${parseFloat(data.price)},
        ${data.builtArea ? parseFloat(data.builtArea) : null},
        ${data.carpetArea ? parseFloat(data.carpetArea) : null},
        ${data.plotArea ? parseFloat(data.plotArea) : null},
        ${data.bedrooms ? parseInt(data.bedrooms) : null},
        ${data.bathrooms ? parseInt(data.bathrooms) : null},
        ${data.furnishing || null}, ${data.parking ? parseInt(data.parking) : 0},
        ${data.floorNumber ? parseInt(data.floorNumber) : null},
        ${data.totalFloors ? parseInt(data.totalFloors) : null},
        ${data.yearBuilt ? parseInt(data.yearBuilt) : null},
        ${data.possessionStatus || null}, ${data.address},
        ${data.latitude ? parseFloat(data.latitude) : null},
        ${data.longitude ? parseFloat(data.longitude) : null},
        ${data.city}, ${data.state}, ${data.amenities || []},
        ${data.photos || []}, ${data.floorPlans || []}
      ) RETURNING id
    `;

    const propertyId = result[0].id;

    // Insert listing-specific data
    if (data.listingType === "rent") {
      await sql`
        INSERT INTO rent_properties (
          property_id, primary_contact, deposit, rent_amount,
          tenure_min_months, available_from, maintenance_charges,
          furnished_included_items
        ) VALUES (
          ${propertyId}, ${data.primaryContact || null},
          ${data.deposit ? parseFloat(data.deposit) : null},
          ${data.rentAmount ? parseFloat(data.rentAmount) : parseFloat(data.price)},
          ${data.tenureMinMonths ? parseInt(data.tenureMinMonths) : null},
          ${data.availableFrom || null},
          ${data.maintenanceCharges ? parseFloat(data.maintenanceCharges) : null},
          ${data.furnishedIncludedItems || []}
        )
      `;
    } else if (data.listingType === "resale") {
      await sql`
        INSERT INTO resale_properties (
          property_id, ownership_type, previous_owners, reason_for_sale
        ) VALUES (
          ${propertyId}, ${data.ownershipType || null},
          ${data.previousOwners ? parseInt(data.previousOwners) : null},
          ${data.reasonForSale || null}
        )
      `;
    } else if (data.listingType === "new") {
      await sql`
        INSERT INTO new_properties (
          property_id, builder_name, completion_date, 
          rera_registration_no, brochure_url
        ) VALUES (
          ${propertyId}, ${data.builderName || null},
          ${data.completionDate || null}, ${data.reraRegistrationNo || null},
          ${data.brochureUrl || null}
        )
      `;
    }

    return Response.json({
      success: true,
      propertyId,
      message: "Property created successfully",
    });
  } catch (error) {
    console.error("Error creating property:", error);
    return Response.json(
      { error: "Failed to create property" },
      { status: 500 },
    );
  }
}
