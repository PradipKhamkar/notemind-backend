const events = {
  noteJob: {
    job_added: 'newNote/job_added',
    job_started: 'newNote/job_started',
    job_done: 'newNote/job_done',
    job_failed: 'newNote/job_failed'
  },
  translate: {
    job_added: 'translateNote/job_added',
    job_started: 'translateNote/job_started',
    job_done: 'translateNote/job_done',
    job_failed: 'translateNote/job_failed'
  }
}

export default { events }