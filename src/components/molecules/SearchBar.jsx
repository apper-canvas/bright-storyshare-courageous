import React, { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"

const SearchBar = ({ onSearch, placeholder = "Search stories, authors, or keywords..." }) => {
  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" 
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-4"
        />
      </div>
      <Button type="submit" variant="primary" className="px-6">
        Search
      </Button>
    </form>
  )
}

export default SearchBar