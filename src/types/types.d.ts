import { DefaultSession, DefaultUser } from "next-auth";
import { Types} from "mongoose";

declare global {
    export interface IVideo {
        _id: string;
        namaPelajaran: string;
        kodePelajaran: string;
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
        userPath: string; // contoh: "userId" atau "userProduct.userId"
    }

    interface User {
        id: string;
        role: string;
    }

    interface Session {
        user: {
            id: string;
            role: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }

    interface Video {
        _id: string;
        namaPelajaran: string;
        kodePelajaran: string; // Ini HANYA ID YouTube
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
        desc: string; // Deskripsi kursus
        video: Video[];
    }

    interface IUserProduct extends Document {
      user: Schema.Types.ObjectId; // Referensi ke ID User
      product: Schema.Types.ObjectId; // Referensi ke ID Product
      status: 'pending' | 'aktif';
      lastWatchedVideoId?: string | null; // ID video terakhir yang ditonton
    }

    type AppError = unknown;
}

// src/types/types.d.ts


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
      image?: string | null;
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