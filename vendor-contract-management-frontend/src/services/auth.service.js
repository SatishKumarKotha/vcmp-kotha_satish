import api from "../api/axios";

//-----------creating  Login Service api method ---------------------\\
export const loginService = async (data) => {
  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data;
};

export const getProfileService =
async () => {

  const response =
    await api.get(
      "/auth/me"
    );

  return response.data;
};

export const updateProfileService =
async (name) => {

  const response =
    await api.patch(
      "/auth/profile",
      { name }
    );

  return response.data;
};

export const changePasswordService =
async (
  oldPassword,
  newPassword
) => {

  const response =
    await api.patch(
      "/auth/change-password",
      {
        oldPassword,
        newPassword
      }
    );

  return response.data;
};

