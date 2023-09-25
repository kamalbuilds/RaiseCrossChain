import { SSX } from "@spruceid/ssx";
import { useEffect, useState } from "react";
import { toCredentialEntry } from "../src/utils/rebase";

interface ICredentialComponent {
  ssx: SSX;
}

const SpruceKitCredentialComponent = ({ ssx }: ICredentialComponent) => {
  const [credentialsList, setCredentialsList] = useState<string[]>([]);
  const [viewingContent, setViewingContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetContent = async (content: string) => {
    setLoading(true);
    try {
      const contentName = content.replace('my-app/', '')
      const { data } = await ssx.credentials.get(contentName);
      setViewingContent(`${content}:\n${JSON.stringify(toCredentialEntry(data), null, 2)}`);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const closeContent = () =>{
    setViewingContent('');
  }

  useEffect(() => {
    const getCredentialList = async () => {
      try {
        const credentialListResult = await ssx.credentials?.list?.({ removePrefix: true });
        if (credentialListResult?.data) {
          setCredentialsList(credentialListResult.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getCredentialList();
  }, [ssx]);

  return (
    <div style={{ marginTop: 25 }}>
      <h2 className="text-yellow-400">GET your SpruceKit Credentials on ETH Chain</h2>
      <table>
        <tbody>
          {credentialsList?.map((credential, i) => (
            <tr key={i}>
              <td>{credential}</td>
              <td>
                <button
                  onClick={() => handleGetContent(credential)}
                  disabled={loading}
                  className="SIWEbutton"
                >
                  <span className="SIWEbutton p-4">
                    GET
                  </span>
                </button>
              </td>
              <td>
                <button
                  onClick={() => closeContent()}
                  disabled={loading}
                  className="SIWEbutton"
                >
                  <span className="SIWEbutton p-4">
                    CLOSE
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <pre style={{ marginTop: 25 }}>
        {viewingContent}
      </pre>
    </div>
  );
};

export default SpruceKitCredentialComponent;
