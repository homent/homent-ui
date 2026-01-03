import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const data = await request.json();

    const {
      propertyPrice,
      propertyType,
      state,
      city,
      includeBrokerage,
      brokeragePercent,
      isFemale,
    } = data;

    if (!propertyPrice || !state) {
      return Response.json(
        { error: "Property price and state are required" },
        { status: 400 },
      );
    }

    const basePrice = parseFloat(propertyPrice);

    // Fetch applicable rates
    let query = `
      SELECT 
        stamp_duty_percent, registration_percent, metro_cess_percent,
        female_discount_percent
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
      CASE WHEN city IS NOT NULL THEN 1 ELSE 2 END,
      CASE WHEN property_type IS NOT NULL THEN 1 ELSE 2 END,
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

    const rate = rates[0];

    // Calculate costs
    const stampDuty = (basePrice * rate.stamp_duty_percent) / 100;
    const registrationFee = (basePrice * rate.registration_percent) / 100;
    const metroCess = rate.metro_cess_percent
      ? (basePrice * rate.metro_cess_percent) / 100
      : 0;

    // Female discount applies to stamp duty
    const femaleDiscount =
      isFemale && rate.female_discount_percent
        ? (stampDuty * rate.female_discount_percent) / 100
        : 0;

    // Brokerage calculation
    const brokerage = includeBrokerage
      ? (basePrice * parseFloat(brokeragePercent || 0)) / 100
      : 0;

    const totalCost =
      basePrice +
      stampDuty +
      registrationFee +
      metroCess -
      femaleDiscount +
      brokerage;

    const calculation = {
      basePrice,
      stampDuty,
      registrationFee,
      metroCess,
      femaleDiscount,
      brokerage,
      totalCost,
      breakdown: {
        stampDutyRate: rate.stamp_duty_percent,
        registrationRate: rate.registration_percent,
        metroCessRate: rate.metro_cess_percent,
        femaleDiscountRate: rate.female_discount_percent,
      },
    };

    return Response.json({ calculation });
  } catch (error) {
    console.error("Error calculating costs:", error);
    return Response.json(
      { error: "Failed to calculate costs" },
      { status: 500 },
    );
  }
}
