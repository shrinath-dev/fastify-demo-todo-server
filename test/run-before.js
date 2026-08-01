import t from "tap";
import dockerHelper, {Containers} from "./docker-helper.js";

const docker = dockerHelper();
t.before(async function before() {
  console.log("before called")
  await docker.startContainer(Containers.mongo)
  console.log('before end')
})
