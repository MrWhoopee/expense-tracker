import { NextRequest, NextResponse } from "next/server";
import { api } from "../../../api";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../../_utils/utils";

interface RouteParams {
  params: Promise<{
    type: string;
    id: string;
  }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const cookieStore = await cookies();
    const { type, id } = await params;

    const body = await request.json();

    const res = await api.patch(`/transactions/${type}/${id}`, body, {
      headers: {
        Cookie: cookieStore.toString(),
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(res.data, { status: 200 });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status },
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
