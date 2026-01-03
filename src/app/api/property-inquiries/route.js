import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const data = await request.json();

    const requiredFields = ["propertyId", "name", "email", "phone"];

    for (const field of requiredFields) {
      if (!data[field]) {
        return Response.json(
          { error: `${field} is required` },
          { status: 400 },
        );
      }
    }

    // Verify property exists
    const property = await sql`
      SELECT id FROM properties WHERE id = ${parseInt(data.propertyId)}
    `;

    if (property.length === 0) {
      return Response.json({ error: "Property not found" }, { status: 404 });
    }

    const result = await sql`
      INSERT INTO property_inquiries (
        property_id, user_name, user_email, user_phone,
        message, inquiry_type
      ) VALUES (
        ${parseInt(data.propertyId)}, ${data.name}, ${data.email},
        ${data.phone}, ${data.message || null}, ${data.inquiryType || "general"}
      ) RETURNING id
    `;

    return Response.json({
      success: true,
      inquiryId: result[0].id,
      message: "Inquiry sent successfully",
    });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return Response.json({ error: "Failed to send inquiry" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit")) || 20;
    const offset = parseInt(searchParams.get("offset")) || 0;

    let query = "SELECT * FROM property_inquiries WHERE 1=1";
    const params = [];

    if (propertyId) {
      query += ` AND property_id = $${params.length + 1}`;
      params.push(parseInt(propertyId));
    }

    if (status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const inquiries = await sql(query, params);

    return Response.json({ inquiries });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return Response.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 },
    );
  }
}
