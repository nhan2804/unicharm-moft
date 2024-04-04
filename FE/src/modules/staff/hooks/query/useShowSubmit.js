import axios from "axios";
import { useQuery } from "react-query";

const useShowSubmit = (projectId, placeId, id) => {
  return useQuery(["show-submit", id], async () => {
    const { data } = await axios.get(
      `projects/${projectId}/submits/${placeId}/data/${id}`
    );
    return data;
  });
};

export default useShowSubmit;
