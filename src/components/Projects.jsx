import axios from "axios";
import { useEffect, useState } from "react";
const repoUrl = `https://api.github.com/users/calm-panda/repos`;

const Projects = () => {
    const [repoData, setRepoData] = useState(null);
    async function getData() {
        await axios
            .get(repoUrl)
            .then(res => { setRepoData(res.data); })
    }
    useEffect(() => {
        getData();
    }, []);
    return (
        repoData ? <div>
            {
                repoData.map((val, idx) =>
                    !val.archived &&
                    <div key={idx} className="relative pb-12 px-32 z-0">
                        <div className="px-24 font-semibold text-2xl"> {val.name} </div>
                        <div className="relative flex flex-row items-center">
                            <div className="flex-grow basis-8/12 border-t border-zinc-600"></div>
                            <a target="_blank" rel="noopener noreferrer" href={val.html_url}>
                                <span className="flex-shrink mx-4 flex flex-row hover:text-zinc-200 hover:cursor-pointer">
                                    <div className="pr-4">Github</div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" fill="currentColor"><path d="M18.88 1.099C18.147.366 17.265 0 16.233 0H3.746C2.714 0 1.832.366 1.099 1.099.366 1.832 0 2.714 0 3.746v12.487c0 1.032.366 1.914 1.099 2.647.733.733 1.615 1.099 2.647 1.099H6.66c.19 0 .333-.007.429-.02a.504.504 0 0 0 .286-.169c.095-.1.143-.245.143-.435l-.007-.885c-.004-.564-.006-1.01-.006-1.34l-.3.052c-.19.035-.43.05-.721.046a5.555 5.555 0 0 1-.904-.091 2.026 2.026 0 0 1-.872-.39 1.651 1.651 0 0 1-.572-.8l-.13-.3a3.25 3.25 0 0 0-.41-.663c-.186-.243-.375-.407-.566-.494l-.09-.065a.956.956 0 0 1-.17-.156.723.723 0 0 1-.117-.182c-.026-.061-.004-.111.065-.15.07-.04.195-.059.378-.059l.26.04c.173.034.388.138.643.311a2.1 2.1 0 0 1 .631.677c.2.355.44.626.722.813.282.186.566.28.852.28.286 0 .533-.022.742-.065a2.59 2.59 0 0 0 .585-.196c.078-.58.29-1.028.637-1.34a8.907 8.907 0 0 1-1.333-.234 5.314 5.314 0 0 1-1.223-.507 3.5 3.5 0 0 1-1.047-.872c-.277-.347-.505-.802-.683-1.365-.177-.564-.266-1.215-.266-1.952 0-1.049.342-1.942 1.027-2.68-.32-.788-.29-1.673.091-2.652.252-.079.625-.02 1.119.175.494.195.856.362 1.086.5.23.14.414.257.553.352a9.233 9.233 0 0 1 2.497-.338c.859 0 1.691.113 2.498.338l.494-.312a6.997 6.997 0 0 1 1.197-.572c.46-.174.81-.221 1.054-.143.39.98.424 1.864.103 2.653.685.737 1.028 1.63 1.028 2.68 0 .737-.089 1.39-.267 1.957-.177.568-.407 1.023-.689 1.366-.282.343-.633.63-1.053.865-.42.234-.828.403-1.223.507a8.9 8.9 0 0 1-1.333.235c.45.39.676 1.005.676 1.846v3.11c0 .147.021.266.065.357a.36.36 0 0 0 .208.189c.096.034.18.056.254.064.074.01.18.013.318.013h2.914c1.032 0 1.914-.366 2.647-1.099.732-.732 1.099-1.615 1.099-2.647V3.746c0-1.032-.367-1.914-1.1-2.647z"></path></svg>
                                </span>
                            </a>
                            <div className="flex-grow border-t border-zinc-600"></div>
                        </div>
                        <div className="px-24 text-sm"> {val.description} </div>
                    </div>)
            }
        </div> : <div>
            Loading...
        </div>
    )
}

export default Projects;