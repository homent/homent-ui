import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const property = await sql`
      SELECT * FROM properties WHERE id = ${parseInt(id)}
    `;

    if (property.length === 0) {
      return Response.json({ error: "Property not found" }, { status: 404 });
    }

    return Response.json({ property: property[0] });
  } catch (error) {
    console.error("Error fetching property:", error);
    return Response.json(
      { error: "Failed to fetch property" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const result = await sql`
      UPDATE properties SET
        title = COALESCE(${data.title || null}, title),
        description = COALESCE(${data.description || null}, description),
        price = COALESCE(${data.price ? parseFloat(data.price) : null}, price),
        status = COALESCE(${data.status || null}, status),
        visibility_type = COALESCE(${data.visibility_type || null}, visibility_type),
        bedrooms = COALESCE(${data.bedrooms ? parseInt(data.bedrooms) : null}, bedrooms),
        bathrooms = COALESCE(${data.bathrooms ? parseInt(data.bathrooms) : null}, bathrooms),
        parking = COALESCE(${data.parking ? parseInt(data.parking) : null}, parking),
        amenities = COALESCE(${data.amenities || null}, amenities),
        photos = COALESCE(${data.photos || null}, photos),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${parseInt(id)}
      RETURNING id
    `;

    if (result.length === 0) {
      return Response.json({ error: "Property not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: "Property updated successfully",
    });
  } catch (error) {
    console.error("Error updating property:", error);
    return Response.json(
      { error: "Failed to update property" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await sql`
      DELETE FROM properties WHERE id = ${parseInt(id)}
    `;

    return Response.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    return Response.json(
      { error: "Failed to delete property" },
      { status: 500 },
    );
  }
}
