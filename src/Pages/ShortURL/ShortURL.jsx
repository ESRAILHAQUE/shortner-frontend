import { useEffect } from "react";
import { useParams } from "react-router-dom";

function ShortURL() {
  const { shortURL } = useParams(); // Access the 'shortURL' parameter

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/url/${shortURL}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data) {
          // Redirect to the original URL
          window.location.href = data;
          // window.location.replace(data)
        } else {
          console.error("Original URL not found");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUrls(); // Call the function to fetch data
  }, [shortURL]); // Dependency array to re-fetch when 'shortURL' changes

  return (
    <>
      <h1>Redirecting...</h1>
    </>
  );
}

export default ShortURL;
