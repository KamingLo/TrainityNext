import { DefaultSession, DefaultUser } from "next-auth";
import { Types} from "mongoose";

declare global {
    export interface IVideo {
        _id: string;
        namaPelajaran: string;
        kodePelajaran: string;
    }

    export interface IReview extends Document {
        userId: mongoose.Types.ObjectId;
        productId: mongoose.Types.ObjectId;
        rating: number;
        comment?: string;
        createdAt: Date;
        updatedAt: Date;
        code?:string;
    }

    export interface IProduct extends Document {
        _id: Types.ObjectId;
        name: string;
        shortDesc: string;
        desc: string;
        video: IVideo[];
    }

    interface CustomToken {
        role?: "admin" | "user" | "teacher" | string;
        email?: string;
    }

    var mongoose: {
        conn: mongoose.Connection | null;
        promise: Promise<mongoose.Connection> | null;
    };

    interface CheckOptions {
        model: string;
        resourceId: string;
        userPath: string;
    }

    interface Video {
        _id: string;
        namaPelajaran: string;
        kodePelajaran: string;
    }

    interface Product {
        _id: string;
        name: string;
        shortDesc: string;
        desc: string;
        video: Video[];
    }

    interface ProductData {
        _id: string;
        name: string;
        desc: string;
        video: Video[];
    }

    interface IUserProduct extends Document {
      user: Schema.Types.ObjectId;
      product: Schema.Types.ObjectId;
      status: 'pending' | 'aktif';
      lastWatchedVideoId?: string | null;
    }

    type AppError = unknown;

    export interface Course {
  videos: Array<{
    link: string;
  }>;
}

export interface CourseData {
  [key: string]: Course;
}

export interface CoursePrices {
  [key: string]: number;
}

export interface PaymentMethodType {
  id: string;
  name: string;
  image: string;
  alt: string;
  inputType?: "text" | "email";
  inputPlaceholder?: string;
  inputLabel?: string;
  isVoucher?: boolean;
  hasQR?: boolean;
  disabled?: boolean;
}

export interface UserOrder {
  user: string;
  kursus: string[];
}

export interface PopupContent {
  icon: string;
  color: string;
  title: string;
  message: string;
  buttonText?: string;
  redirectTo?: string;
}

}

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
    };
  }

    interface ProductPreview {
        _id: string;
        name: string;
        shortDesc: string;
        kodePelajaranPertama: string | null;
        isOwned: boolean;
    }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}


export {}