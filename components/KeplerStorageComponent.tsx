"use client";
import { SSX } from "@spruceid/ssx";
import { useEffect, useState } from "react";

interface IKeplerStorageComponent {
  ssx: SSX
}

const KeplerStorageComponent = ({ ssx }: IKeplerStorageComponent) => {

  const [key, setKey] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [contentList, setContentList] = useState<Array<string>>([]);
  const [viewingContent, setViewingContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getContentList();
  }, []);

  const getContentList = async () => {
    setLoading(true);
    let { data } = await ssx.storage.list();
    data = data.filter((d: string) => d.includes('/content/'))
    setContentList(data);
    setLoading(false);
  };

  const handlePostContent = async (key: string, value: string) => {
    if (!key || !value) {
      alert('Invalid key or value');
      return;
    }
    const formatedKey = 'content/' + key.replace(/\ /g, '_');
    setLoading(true);
    await ssx.storage.put(formatedKey, value);
    setContentList((prevList) => [...prevList, `my-app/${formatedKey}`]);
    setKey('');
    setValue('');
    setLoading(false);
  };

  const handleGetContent = async (content: string) => {
    setLoading(true);
    const contentName = content.replace('my-app/', '')
    const { data } = await ssx.storage.get(contentName);
    setViewingContent(`${content}:\n${data}`);
    setLoading(false);
  };

  const handleDeleteContent = async (content: string) => {
    setLoading(true);
    const contentName = content.replace('my-app/', '')
    await ssx.storage.delete(contentName);
    setContentList((prevList) => prevList.filter((c) => c !== content));
    setLoading(false);
  };

  return (
    <div style={{ marginTop: 50 }}>
      <p>Store your contribution data in Kepler Orbit</p>
      <p style={{ maxWidth: 500, fontSize: 12 }}>
        Kepler is a decentralized storage system that uses DIDs and Authorization Capabilities to define Orbits,
        Now store your contributions to projects at a secure place so you can check on them later.
      </p>
      <input
        type="text"
        placeholder="Project ID"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        disabled={loading}
        className="p-4 w-full my-2"
      />
      <input
        type="text"
        placeholder="Amount Donated"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={loading}
        className="p-4 w-full my-2"
      />
      <br />
      <button
        onClick={() => handlePostContent(key, value)}
        disabled={loading}
        style={{ marginTop: 15 }}
        className="SIWEbutton"
      >
        <span>
          POST
        </span>
      </button>
      <p><b>My Contribution data stored on Kepler</b></p>
      <table>
        <tbody>
          {contentList?.map((content, i) => <tr key={i}>
            <td>
              {content}
            </td>
            <td>
              <button
                onClick={() => handleGetContent(content)}
                disabled={loading}
                className="SIWEbutton"
              >
                <span>
                  GET
                </span>
              </button>
            </td>
            <td>
              <button
                onClick={() => handleDeleteContent(content)}
                disabled={loading}
                className="SIWEbutton"
              >
                <span>
                  DELETE
                </span>
              </button>
            </td>
          </tr>)}
        </tbody>
      </table>
      <pre style={{ marginTop: 25, marginBottom: 0 }}>
        {viewingContent}
      </pre>
    </div>
  );
}

export default KeplerStorageComponent;