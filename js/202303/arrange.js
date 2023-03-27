/**
 * arrange('test').execute();
 * output: test is notified
 *
 * arrange('test').do('commit').execute();
 * output: test is notified
 * output: start to commit
 *
 * arrange('test').wait(5).do('commit').execute();
 * output: test is notified
 * wait 5s
 * output: start to commit
 */

function arrange(taskId) {
  const tasks = []
  tasks.push(() => {
    console.log(`${taskId} is notified`)
  })

  function doSomething(something) {
    tasks.push(() => {
      console.log(`Start to ${something}`)
    })

    return this
  }

  function wait(duration) {
    tasks.push(
      () =>
        new Promise((resolve) => {
          console.log(`Wait ${duration}s`)
          setTimeout(resolve, duration * 1000)
        })
    )

    return this
  }

  function waitFirst(duration) {
    tasks.shift(
      () =>
        new Promise((resolve) => {
          console.log(`Wait ${duration}s`)
          setTimeout(resolve, duration * 1000)
        })
    )

    return this
  }

  async function execute() {
    for (const t of tasks) {
      await t()
    }
  }

  return {
    do: doSomething,
    wait,
    waitFirst,
    execute
  }
}

arrange('Tom').wait(3).do('abc').do('bcd').execute()
