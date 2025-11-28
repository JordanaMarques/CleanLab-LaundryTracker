
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { OrderRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    orders: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "Date of the order (e.g., 14/07/2025)" },
          customerName: { type: Type.STRING, description: "Name of the customer" },
          address: { type: Type.STRING, description: "Address of the customer" },
          orderNumber: { type: Type.STRING, description: "Shopify order number (e.g., #1015)" },
          laundryService: { type: Type.STRING, description: "Name of the laundry service provider" },
          
          clientTotalPaid: { type: Type.STRING, description: "Client total amount paid including discount (e.g. €119.80)" },
          shippingPrice: { type: Type.STRING, description: "Shipping price (e.g. €0.00)" },
          payoutDate: { type: Type.STRING, description: "Date of payout (e.g., 21-07-2025)" },
          shopifyPayout: { type: Type.STRING, description: "Net payout from Shopify (e.g. €117.18)" },
          shopifyFee: { type: Type.STRING, description: "Shopify transaction fee (e.g., €2.62)" },
          discountAmount: { type: Type.STRING, description: "Discount amount (e.g. €4.95)" },
          discountPercentage: { type: Type.STRING, description: "Discount percentage (e.g. 3.97%)" },
          
          washDeductionKgs: { type: Type.STRING, description: "Monetary deduction for wash/kgs (e.g. 'Afdracht was (kgs)' column, €54.60)" },
          othersDeduction: { type: Type.STRING, description: "Other deductions (e.g. €18.20)" },
          totalDeduction: { type: Type.STRING, description: "Total deduction amount" },
          
          itemQuantity: { type: Type.STRING, description: "Quantity of items (e.g. 1)" },
          itemDescription: { type: Type.STRING, description: "Description or weight of item (e.g. '36kg' or '12kg')" },
          weight: { type: Type.STRING, description: "Numeric weight extracted from description (e.g. '36kg')" }
        },
        required: ["customerName", "orderNumber"]
      }
    }
  }
};

export const analyzeImage = async (base64Image: string): Promise<OrderRecord[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          {
            text: "Analyze this image (spreadsheet or photo). Extract the following for each order row: Date, Customer Name, Address, Order Number, Client Total Paid, Shipping Price, Payout Date, Shopify Payout, Shopify Fee, Discount Amount, Discount Percentage, Wash Deduction (Afdracht was kgs), Others Deduction, Total Deduction, Item Quantity, and Item Description. Also infer the Laundry Service if possible."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
        throw new Error("No data returned from Gemini.");
    }

    const result = JSON.parse(jsonText);
    
    // Ensure extracted data has default empty strings for missing optional fields
    const safeOrders = (result.orders || []).map((order: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        date: order.date || new Date().toLocaleDateString(),
        customerName: order.customerName || "Unknown",
        address: order.address || "",
        orderNumber: order.orderNumber || "",
        weight: order.weight || order.itemDescription || "0kg",
        laundryService: order.laundryService || "General",
        
        clientTotalPaid: order.clientTotalPaid || "0.00",
        shippingPrice: order.shippingPrice || "0.00",
        payoutDate: order.payoutDate || "",
        shopifyPayout: order.shopifyPayout || "0.00",
        shopifyFee: order.shopifyFee || "0.00",
        discountAmount: order.discountAmount || "0.00",
        discountPercentage: order.discountPercentage || "0%",
        
        washDeductionKgs: order.washDeductionKgs || "0.00",
        othersDeduction: order.othersDeduction || "0.00",
        totalDeduction: order.totalDeduction || "0.00",
        
        itemQuantity: order.itemQuantity || "1",
        itemDescription: order.itemDescription || ""
    }));

    return safeOrders;

  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};
