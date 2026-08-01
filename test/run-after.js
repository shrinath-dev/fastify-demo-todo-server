import t from "tap";
import dockerHelper, {Containers} from "./docker-helper.js";

const docker = dockerHelper();

t.teardown(async function after() {
  console.log('after called');
  await docker.stopContainer(Containers.mongo)
})
