import {
  Card,
  CardContent,
  Typography,
  Box
} from "@mui/material";

const KpiCard = ({
  title,
  value,
  color
}) => {

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        borderLeft: `6px solid ${color}`
      }}
    >
      <CardContent>

        <Typography
          color="text.secondary"
          variant="body2"
        >
          {title}
        </Typography>

        <Box mt={1}>
          <Typography
            variant="h4"
            fontWeight="bold"
          >
            {value}
          </Typography>
        </Box>

      </CardContent>
    </Card>
  );

};

export default KpiCard;