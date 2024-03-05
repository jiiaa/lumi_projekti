import axios from 'axios';

// Download the html page
async function getHtml(url: string): Promise<string> {
  try {
    const response = await axios.get(url);

    if (response.status !== 200) {
      console.error("Error in fetching html");
      return "";
    }
    
    const html: string = response.data as string;
    return html;

  } catch (err) {
    console.error(err);
    return "";
  }
}

export default { getHtml };
