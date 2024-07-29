const formDataAndIntroText = {
  linkFormData: {
    formData: {
      title: '',
      url: '',
      description: '',
      category: 'All Resources',
      expires: '',
      deleteOnExpire: false
    },
    introText: `Use this form to add or update a link on the website. Links must have a title and a URL.
    Links often change, especially at the start of each new school year. You can set an expiration date for your links if you like.`
  },
  clubFormData: {
    formData: {
      title: '',
      when: '',
      image: '',
      description: '',
      expires: '',
      deleteOnExpire: false
    },
    introText: `Use this form to add or update a school club on the website. To help keep the clubs up to date, you can set an expiration date for your club. Once the date
    is reached, you can set your club to either delete automatically, or to remind you to update it.`
  },
  electiveFormData: {
    formData: {
      title: '',
      description: '',
      expires: '',
      deleteOnExpire: false,
      duration: 'YEAR LONG',
      cte: false,
      image: '',
      pathway: 'Traditional Electives'
    },
    introText: `Use this form to add or update an elective on the website. To help keep the electives up to date, you can set an expiration date for your elective. Once the date
    is reached, you can set your elective to either delete automatically, or to remind you to update it.`
  },
  staffFormData: {
    formData: {
      name: '',
      position: '',
      image: '',
      email: '',
      phone: '',
      bio: '',
      department: '',
      expires: '',
      deleteOnExpire: false
    },
    introText: `Use this form to add or update a new staff member's information and photo on the staff section of the website. This won't invite that member to join the app.
    If your account supports that feature, you can invite new staff to the app via the Settings page.`
  },
  eventFormData: {
    formData: {
      title: '',
      description: '',
      author: '',
      image: '',
      date: '',
      startTime: '',
      endTime: ''
    },
    introText: `Use this form to add or update an event on the website. To help keep the events up to date, you can set an expiration date for your event. Once the date
    is reached, you can set your event to either delete automatically, or to remind you to update it.`
  }
};

export default formDataAndIntroText;