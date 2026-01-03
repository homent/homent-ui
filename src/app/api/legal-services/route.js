import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const data = await request.json();

    const requiredFields = [
      "userName",
      "userEmail",
      "userPhone",
      "serviceType",
      "consultationMode",
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

    const result = await sql`
      INSERT INTO legal_services (
        user_name, user_email, user_phone, service_type,
        consultation_mode, city, state, remarks, base_fee
      ) VALUES (
        ${data.userName}, ${data.userEmail}, ${data.userPhone},
        ${data.serviceType}, ${data.consultationMode}, ${data.city},
        ${data.state}, ${data.remarks || null}, ${5000}
      ) RETURNING id
    `;

    return Response.json({
      success: true,
      serviceId: result[0].id,
      message: "Legal service request submitted successfully",
    });
  } catch (error) {
    console.error("Error creating legal service request:", error);
    return Response.json(
      { error: "Failed to submit request" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit")) || 20;
    const offset = parseInt(searchParams.get("offset")) || 0;

    let query = "SELECT * FROM legal_services WHERE 1=1";
    const params = [];

    if (status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const services = await sql(query, params);

    return Response.json({ services });
  } catch (error) {
    console.error("Error fetching legal services:", error);
    return Response.json(
      { error: "Failed to fetch services" },
      { status: 500 },
    );
  }
}
