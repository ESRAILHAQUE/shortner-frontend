/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { MdOutlineContentCopy, MdOutlineDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";
import { useAuth } from "../hooks/AuthContext";

const Shorter = () => {
  const [url, setUrl] = useState("");
  const [user, setUser] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [urls, setUrls] = useState([]); // State to store fetched URLs
  const [loading, setLoading] = useState(true); // Loading for fetching
  const [shortening, setShortening] = useState(false); // Loading for URL shortening
  const { currentUser } = useAuth(); // Access currentUser from AuthContext

  // Set the default domain
  const defaultDomain = import.meta.env.VITE_BACKEND_URL; 
  const fetchUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/user/role-status/${currentUser.email}`
      );
      const data = await response.json();

      if (response.ok) {
        setUser(data);
      } else {
        setError("Failed to fetch user details.");
      }
    } catch (error) {
      setError("An error occurred while fetching user details.");
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
   console.log(user);
  console.log(user.userType)

  // Fetch URLs from the backend
  const fetchUrls = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/url/getUrl?email=${
          currentUser.email
        }`
      );
      const data = await response.json();
      if (response.ok) {
        setUrls(data.data); // Set the fetched URLs in the state
      } else {
        console.error("Failed to fetch URLs");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading to false after the data is fetched
    }
  };

  useEffect(() => {
    fetchUrls(); // Call the fetch function on component mount
  }, []);
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url) {
      Swal.fire("Error", "Please enter a valid URL.", "error");
      return;
    }

    // Check if the user has exceeded their URL shortening limit
    const userLimit = user?.userType === "premium" ? 5 : 2;

    if (urls.length >= userLimit) {
      Swal.fire(
        "Limit Reached",
        `You can only shorten ${userLimit} URLs.`,
        "error"
      );
      return;
    }

    setShortening(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/url/shorten`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: currentUser.email,
            originalUrl: url, // Pass the original URL
            shortUrl: defaultDomain, // Pass the default domain as shortUrl
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setShortenedUrl(data.shortUrl);
        setUrls((prevUrls) => [...prevUrls, data]); // Add new URL to the list
        fetchUrls();
      } else {
        console.error("Failed to shorten URL");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setShortening(false);
    }
  };


  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/url/deleteUrl/${id}`,
            {
              method: "DELETE",
            }
          );
          if (response.ok) {
            Swal.fire("Deleted!", "Your URL has been deleted.", "success");
            setUrls((prevUrls) => prevUrls.filter((url) => url._id !== id));
          } else {
            console.error("Failed to delete URL");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    });
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(`${url.shortUrl}`);
    Swal.fire("Copied!", "URL has been copied to clipboard.", "success");
  };
  // Fetch all users from the backend
 

  return (
    <div className="w-full p-8 bg-gray-800 text-white">
      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="flex justify-between bg-gray-900 rounded-lg p-4 mb-4"
      >
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="ml-4 bg-gray-700 text-white p-2 rounded w-full"
        />
        <button
          type="submit"
          className="ml-4 p-2 bg-gray-600 text-white rounded"
          disabled={shortening}
        >
          {shortening ? "Shortening..." : "Shorten"}
        </button>
      </form>

      {/* URL List Section */}
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : urls.length > 0 ? (
          <ul>
            {urls.map((url, index) => (
              <li
                key={index}
                className="flex justify-between bg-gray-700 text-white rounded p-4 mb-4"
              >
                <div>
                  <p>Original: {url.originalUrl}</p>
                  <div>
                    <p>
                      Shortened URL:
                      <a
                        href={url.shortUrl}
                        className="underline text-blue-400 cursor-pointer"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {url.shortUrl}
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="mr-10">Clicks: {url.clickCount}</p>
                  <button
                    className="text-2xl mr-4"
                    onClick={() => handleCopy(url)}
                  >
                    <MdOutlineContentCopy />
                  </button>
                  <MdOutlineDeleteOutline
                    className="text-3xl text-red-500 cursor-pointer"
                    onClick={() => handleDelete(url._id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No URLs found</p>
        )}
      </div>

      {/* Instruction Section */}
      <div className="mt-10 p-6 bg-gray-900 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Tasks for Approval</h3>
        <p>Invite 100 members on Facebook Groups:</p>
        <a
          href="https://www.facebook.com/share/g/aMWs2oLB9xgjhzGm/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline"
        >
          Facebook Invite Link
        </a>
        <br />

        <p className="mt-4">Add 20 people to Skype group:</p>
        <a
          href="https://join.skype.com/taesRVnxH1tS"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline"
        >
          Skype Invite Link
        </a>

        <div className="mt-4">
          <p>
            After submitting:
            <br />
            - Join the Facebook group and send invites to 100 people.
            <br />
            - Join the Skype group and add 20 people.
            <br />I will approve the task as soon as you send the screenshot and
            video to Skype.
          </p>
        </div>

        <div className="mt-4">
          <p>
            Send screenshots and videos to Skype:
            <br />
            <strong>Skype ID: live:.cid.2570906b4464082c</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Shorter;
