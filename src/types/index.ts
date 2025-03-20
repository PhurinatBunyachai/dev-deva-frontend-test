export interface Header {
  key: string;
  name: string;
}

export interface Item {
  id: number;
  image: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: Date;
}

export interface UserFormData {
  profile_picture: string;
  first_name: string;
  last_name: string;
  gender: string;
  birthday: Date | null;
}
