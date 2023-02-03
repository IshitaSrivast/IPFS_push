import React from 'react';

import './App.css';
import { create, CID, IPFSHTTPClient } from "ipfs-http-client";








function App() {
  const [images, setImages] = React.useState<{ cid: CID; path: string }[]>([]);

  const projectId = "2KzzJOKSWDd8V3PKw7IOsFIC0ct";
const projectSecretKey = "a79672ebee7b3c37a09b294d9b9431ee";
const authorization = "Basic " + btoa(projectId + ":" + projectSecretKey);

  let ipfs: IPFSHTTPClient | undefined;
  try {
    ipfs = create({
      url: "https://ipfs.infura.io:5001/api/v0",
      headers: {
        authorization,
    },

    });
  } catch (error) {
    console.error("IPFS error ", error);
    ipfs = undefined;
  }
  /**
   * @description event handler that uploads the file selected by the user
   */
   const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const files = (form[0] as HTMLInputElement).files;

    if (!files || files.length === 0) {
      
      return alert("No files selected");
    }

    const file = files[0];
    // upload files
    const result = await (ipfs as IPFSHTTPClient).add(file);
    
    
    setImages([
      ...images,
      {
        cid: result.cid,
        path: result.path,
      },
    ]);
    console.log(result.path);
    console.log(result.cid);
    form.reset();
  };
  

  return (
    <div className="App">
      <header className="App-header">
      {ipfs && (
          <>
            <p>Upload File using IPFS</p>

            <form onSubmit={onSubmitHandler}>
              <input name="file" type="file" />

              <button type="submit">Upload File</button>
            </form>

            <div>
              {images.map((image, index) => (
                <img
                  alt={`Uploaded #${index + 1}`}
                  src={"https://media-coin.infura-ipfs.io/ipfs/" + image.path}
                  style={{ maxWidth: "400px", margin: "15px" }}
                  key={image.cid.toString() + index}
                />
              ))}
            </div>
          </>
        )}
        {!ipfs && (
          <p>Oh oh, Not connected to IPFS. Checkout out the logs for errors</p>
        )}
        
      </header>
    </div>
  );
}

export default App;
