import sql from "@/app/api/utils/sql";
import { hash } from "argon2";

export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "mobile",
      "gender",
      "dateOfBirth",
      "address",
      "password",
      "totalExperience",
      "commissionPercentage",
      "role",
      "bankingName",
      "bankName",
      "bankAccountNumber",
      "ifscCode",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return Response.json(
          { error: `${field} is required` },
          { status: 400 },
        );
      }
    }

    // Validate password confirmation
    if (data.password !== data.confirmPassword) {
      return Response.json(
        { error: "Passwords do not match" },
        { status: 400 },
      );
    }

    // Validate account number confirmation
    if (data.bankAccountNumber !== data.confirmAccountNumber) {
      return Response.json(
        { error: "Bank account numbers do not match" },
        { status: 400 },
      );
    }

    // Check if email already exists
    const existingPartner = await sql`
      SELECT id FROM partners WHERE email = ${data.email}
    `;

    if (existingPartner.length > 0) {
      return Response.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    // Hash password
    const passwordHash = await hash(data.password);

    // Insert partner data
    const result = await sql`
      INSERT INTO partners (
        first_name, last_name, email, mobile, gender, date_of_birth,
        address, password_hash, serving_areas, total_experience,
        known_languages, commission_percentage, business_contact_number,
        role, banking_name, bank_name, bank_account_number, ifsc_code, upi_id
      ) VALUES (
        ${data.firstName}, ${data.lastName}, ${data.email}, ${data.mobile},
        ${data.gender}, ${data.dateOfBirth}, ${data.address}, ${passwordHash},
        ${data.servingAreas}, ${parseInt(data.totalExperience)},
        ${data.knownLanguages}, ${parseFloat(data.commissionPercentage)},
        ${data.businessContactNumber || null}, ${data.role}, ${data.bankingName},
        ${data.bankName}, ${data.bankAccountNumber}, ${data.ifscCode},
        ${data.upiId || null}
      ) RETURNING id
    `;

    return Response.json({
      success: true,
      partnerId: result[0].id,
      message: "Partner registration submitted successfully",
    });
  } catch (error) {
    console.error("Partner registration error:", error);
    return Response.json(
      { error: "Registration failed. Please try again." },
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

    let query = `
      SELECT 
        id, first_name, last_name, email, mobile, 
        serving_areas, total_experience, role, status,
        created_at
      FROM partners
    `;

    const params = [];

    if (status) {
      query += ` WHERE status = $${params.length + 1}`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const partners = await sql(query, params);

    return Response.json({ partners });
  } catch (error) {
    console.error("Error fetching partners:", error);
    return Response.json(
      { error: "Failed to fetch partners" },
      { status: 500 },
    );
  }
}
