namespace TodoAppAPI.Models
{
    public class Activity
    {
        public string ActivUId { get; set; } = Guid.NewGuid().ToString();
        public string Action { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public string CardUId { get; set; } = string.Empty;
        public Card? Card { get; set; }

        public string UserUId { get; set; } = string.Empty;
        public User? User { get; set; }
    }
}
