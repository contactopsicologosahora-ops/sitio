import { NextResponse } from 'next/server';
import { GoogleAdsApi, enums } from 'google-ads-api';

// Inicializar cliente con credenciales desde el entorno
const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || 'today';

        // Mapear el rango del frontend a la sintaxis GAQL de Google Ads
        // Soporta: TODAY, YESTERDAY, LAST_7_DAYS, THIS_WEEK_SUN_TODAY, LAST_WEEK_SUN_SAT, LAST_14_DAYS, LAST_30_DAYS, LAST_BUSINESS_WEEK, LAST_WEEK_STARTING_TUESDAY, LAST_WEEK_STARTING_MONDAY, THIS_MONTH, LAST_MONTH, ALL_TIME, THIS_QUARTER, LAST_QUARTER, THIS_YEAR, LAST_YEAR
        let gaqlRange = "TODAY";
        switch (range) {
            case 'today': gaqlRange = 'TODAY'; break;
            case 'last_7_days': gaqlRange = 'LAST_7_DAYS'; break;
            case 'last_30_days': gaqlRange = 'LAST_30_DAYS'; break;
            case 'this_month': gaqlRange = 'THIS_MONTH'; break;
            case 'last_month': gaqlRange = 'LAST_MONTH'; break;
            case 'this_year': gaqlRange = 'THIS_YEAR'; break;
            default: gaqlRange = 'TODAY'; break;
        }

        const customerId = process.env.GOOGLE_ADS_CLIENT_ACCOUNT_ID?.replace(/-/g, '') || "2376893801";
        const loginCustomerId = process.env.GOOGLE_ADS_MCC_ID?.replace(/-/g, '') || "1970123543";

        // Cargar contexto del cliente
        const customer = client.Customer({
            customer_id: customerId,
            login_customer_id: loginCustomerId,
            refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
        });

        // Consulta de métricas globales sin granularidad de segmentos para obtener los totales
        const query = `
            SELECT
                metrics.impressions,
                metrics.clicks,
                metrics.cost_micros,
                metrics.average_cpc,
                metrics.cost_per_conversion
            FROM customer
            WHERE segments.date DURING ${gaqlRange}
        `;

        console.log(`Executing Google Ads Query: ${query}`);
        const response = await customer.query(query);

        // Si no hay respuesta o datos, retornamos ceros
        if (!response || response.length === 0) {
            return NextResponse.json({
                impressions: 0,
                clicks: 0,
                cost: 0,
                cpc: 0,
                costPerConversion: 0
            });
        }

        const metrics = response[0]?.metrics || {};

        // Limpiar los datos (cost_micros a formato moneda estándar, etc.)
        const impressions = parseInt(metrics.impressions as any) || 0;
        const clicks = parseInt(metrics.clicks as any) || 0;
        const cost = (parseInt(metrics.cost_micros as any) || 0) / 1000000;
        const cpc = (parseInt(metrics.average_cpc as any) || 0) / 1000000;
        const costPerConversion = (parseInt(metrics.cost_per_conversion as any) || 0) / 1000000;

        return NextResponse.json({
            impressions,
            clicks,
            cost,
            cpc,
            costPerConversion
        });

    } catch (error: any) {
        console.error("Error fetching from Google Ads:", error.message || error);
        return NextResponse.json({ error: "Failed to fetch ads data", details: error.message }, { status: 500 });
    }
}
