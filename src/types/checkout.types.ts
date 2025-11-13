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
