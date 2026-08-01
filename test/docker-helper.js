import Docker from "dockerode";


export const Containers = {
  mongo: {
    name: 'fastify-mongo',
    Image: 'mongo:latest',
    Tty: false,
    HostConfig: {
      PortBindings: {
        '27017/tcp': [{HostIp: '0.0.0.0', HostPort: '27017'}]
      },
      AutoRemove: true,
    }
  }
}





export default function dockerConsole() {

  const docker = new Docker();

  async function pullImage(container) {

    const pullStream = await docker.pull(container.Image);

    return new Promise((resolve, reject) => {
      docker.modem.followProgress(pullStream, onFinish)

      function onFinish(err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }
    })
  }

  return {

    async getRunningContainer(container) {
      const containers = await docker.listContainers();
      return containers.find(running => {
        return running.Names.some(name => name.includes(container.name))
      })
    },
    async startContainer(container) {
      const run = await this.getRunningContainer(container);

      if (!run) {
        await pullImage(container);
        const containerObj = await docker.createContainer(container)
        await containerObj.start();
      }
    },
    async stopContainer(container) {
      const run = await this.getRunningContainer(container);
      if (run) {
        const containerObj = docker.getContainer(run.Id);
        await containerObj.stop();
      }
    }
  }
}
