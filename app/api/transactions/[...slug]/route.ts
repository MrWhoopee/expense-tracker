import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

interface RouteParams {
  params: Promise<{ slug: string[] }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const cookieStore = await cookies();
    const { slug } = await params;

    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");
    const search = searchParams.get("search");

    const res = await api.get(`/transactions/${slug[0]}`, {
      params: {
        ...(date && { date }),
        ...(search && { search }),
      },
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const cookieStore = await cookies();
    const { slug } = await params;

    const res = await api.delete(`/transactions/${slug[0]}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error: unknown) {
  if (isAxiosError(error)) {
    logErrorResponse(error.response?.data);
    return NextResponse.json(
      { error: error.message, response: error.response?.data },
      { status: error.status },
    );
  }
  logErrorResponse({ message: (error as Error).message });
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
