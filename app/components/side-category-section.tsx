import { Products } from "@/public/shared/app.config"

const SideCategorySection = () => {
  return (
    <div className="hidden lg:flex lg:grid lg:grid-cols-2 gap-4 mb-5 lg:mb-10">
      <a href={Products.business.url}>
        <div className="category-cube"><span className="px-5 mb-2"><img src="images/icons/business.png" className="m-auto" /></span><span>Business</span></div>
      </a>
      <a href={Products.sale.url}>
        <div className="category-cube"><span className="px-5 mb-2"><img src="images/icons/realestate.png" className="m-auto" /></span><span>Real Estate</span></div>
      </a>
      <a href={Products.job.url}>
        <div className="category-cube"><span className="px-5 mb-2"><img src="images/icons/job.png" className="m-auto" /></span><span>Job Vacancy</span></div>
      </a>
      <a href="/">
        <div className="category-cube"><span className="px-5 mb-2"><img src="images/icons/classifieds.png" className="m-auto" /></span><span>Classifieds</span></div>
      </a>
    </div>
  )
}

export default SideCategorySection