export const loginUser = async (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email === "test@test.com") {
        resolve({ token: "fake-jwt-token" });
      } else {
        reject({ message: "Invalid credentials" });
      }
    }, 1000);
  });
};

export const registerUser = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
};