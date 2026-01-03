import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");
    const city = searchParams.get("city");
    const propertyType = searchParams.get("propertyType");

    if (!state) {
      return Response.json({ error: "State is required" }, { status: 400 });
    }

    let query = `
      SELECT 
        stamp_duty_percent, registration_percent, metro_cess_percent,
        female_discount_percent, effective_date
      FROM cost_calculator_rates
      WHERE state = $1
    `;

    const params = [state];
    let paramIndex = 2;

    if (city) {
      query += ` AND (city = $${paramIndex} OR city IS NULL)`;
      params.push(city);
      paramIndex++;
    }

    if (propertyType) {
      query += ` AND (property_type = $${paramIndex} OR property_type IS NULL)`;
      params.push(propertyType);
      paramIndex++;
    }

    query += ` ORDER BY 
      CASE WHEN city = $${city ? "2" : "NULL"} THEN 1 ELSE 2 END,
      CASE WHEN property_type = $${propertyType ? (city ? "3" : "2") : "NULL"} THEN 1 ELSE 2 END,
      effective_date DESC
      LIMIT 1
    `;

    const rates = await sql(query, params);

    if (rates.length === 0) {
      return Response.json(
        { error: "No rates found for the specified location" },
        { status: 404 },
      );
    }

    return Response.json({ rates: rates[0] });
  } catch (error) {
    console.error("Error fetching calculator rates:", error);
    return Response.json({ error: "Failed to fetch rates" }, { status: 500 });
  }
}
